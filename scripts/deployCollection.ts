import { Address, toNano } from 'ton-core';
import { NetworkProvider } from '@ton-community/blueprint';
import { NftCollection } from '../build/Collection/tact_NftCollection';
import { buildOnchainMetadata } from '../contracts/build_data';

const metadata = {
    name: 'INFLUENCE LIKES WORLD',
    description: 'KAK JE YA HAROSH',
    image: 'https://yt3.googleusercontent.com/YR8JivTsOQ4svnDFCdnIqYAPhwIeTRg8w0Sukv1orUYJoN2iZtaEprhWXcweMdrtcGGmptvSgQ=s176-c-k-c0x00ffffff-no-rj',
    cover_image:
        'https://yt3.googleusercontent.com/YR8JivTsOQ4svnDFCdnIqYAPhwIeTRg8w0Sukv1orUYJoN2iZtaEprhWXcweMdrtcGGmptvSgQ=s176-c-k-c0x00ffffff-no-rj',
    // social_links: ['https://www.instagram.com/inonepurrfecttouch/'],
};

export async function run(provider: NetworkProvider) {
    const collection = provider.open(await NftCollection.fromInit(buildOnchainMetadata(metadata), 1n, 1n));

    await collection.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(collection.address);

    // run methods on `collection`
}
