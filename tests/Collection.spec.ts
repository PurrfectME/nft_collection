import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { toNano } from 'ton-core';
import { Collection } from '../wrappers/Collection';
import '@ton-community/test-utils';

describe('Collection', () => {
    let blockchain: Blockchain;
    let collection: SandboxContract<Collection>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        collection = blockchain.openContract(await Collection.fromInit());

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await collection.send(
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
            to: collection.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and collection are ready to use
    });
});
