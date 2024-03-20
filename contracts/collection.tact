import "@stdlib/deploy";
import "@stdlib/ownable";
import "./item";

struct CollectionData {
    next_index: Int;
    content: Cell;
    owner: Address;
}

contract NftCollection with Ownable, Deployable, NftRoyalty {
    owner: Address;
    next_index: Int as uint256 = 0;
    content: Cell;
    royalty_destination: Address;
    numerator: Int as uint16;
    denominator: Int as uint16;

    init(content: Cell, numerator: Int, denominator: Int) {
        self.owner = sender();
        self.content = content;
        self.royalty_destination = myAddress();
        self.numerator = numerator;
        self.denominator = denominator;
    }

    receive(msg: RequestNftDeploy) {
        self.requireOwner();
        // require(msg.index <= self.next_index, "Invalid Index");
        
        let nft_init: StateInit = initOf NftItem(myAddress(), self.next_index);
        let nft_address: Address = contractAddress(nft_init);
        let required: Int = gas_consumption + min_balance;
        send(SendParameters{
            to: nft_address,
            value: required,
            mode: SendIgnoreErrors,
            bounce: true,
            data: nft_init.data,
            code: nft_init.code,
            body: NftDeploy{
                owner: msg.owner,
                content: msg.content,
                royalty_destination: self.royalty_destination,
                numerator: self.numerator,
                denominator: self.denominator
            }.toCell()
        });
        self.next_index = self.next_index + 1;
    }

    receive(msg: LikeItem){
        
    }

    get fun get_collection_data(): CollectionData {
        return CollectionData{next_index: self.next_index + 1, content: self.content, owner: self.owner};
    }
    get fun get_nft_address_by_index(index: Int): Address {
        return contractAddress(initOf NftItem(myAddress(), index));
    }
    get fun get_nft_content(index: Int, individual_content: Cell): Cell {
        return individual_content;
    }
}