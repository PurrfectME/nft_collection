import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { toNano } from 'ton-core';
import { Item } from '../wrappers/Item';
import '@ton-community/test-utils';

describe('Item', () => {
    let blockchain: Blockchain;
    let item: SandboxContract<Item>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        item = blockchain.openContract(await Item.fromInit());

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await item.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: item.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and item are ready to use
    });
});
