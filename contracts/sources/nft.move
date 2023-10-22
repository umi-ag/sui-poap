module coco::nft {
    use sui::url::{Self, Url};
    use std::string::{Self, String};
    use sui::object::{Self, ID, UID};
    use sui::event;
    use sui::transfer;
    use sui::vec_set::{Self, VecSet};
    use sui::dynamic_field as df;
    use sui::dynamic_object_field as dof;
    use sui::tx_context::{Self, TxContext};

    struct CoCoNFT has key, store {
        id: UID,
        name: String,
        description: String,
        url: Url,
        count: u64,
    }

    struct CoCoList has key, store {
        id: UID,
    }

    struct CoCoItem has key, store {
        id: UID,
        // name: String,
        // description: String,
        url: Url,
    }

    fun init(ctx: &mut TxContext) {
        let list = CoCoList{
            id: object::new(ctx),
        };
        transfer::share_object(list);
    }

    struct NFTMinted has copy, drop {
        // The Object ID of the NFT
        object_id: ID,
        // The creator of the NFT
        creator: address,
        // The name of the NFT
        name: string::String,
    }

    fun date_key(): String {
        string::utf8(b"date")
    }

    fun item_key(): String {
        string::utf8(b"item")
    }

    /// Get the NFT's `name`
    public fun name(nft: &CoCoNFT): &string::String {
        &nft.name
    }

    /// Get the NFT's `description`
    public fun description(nft: &CoCoNFT): &string::String {
        &nft.description
    }

    /// Get the NFT's `url`
    public fun url(nft: &CoCoNFT): &Url {
        &nft.url
    }

    /// Create a new testnet_nft
    public fun new_nft(
        name: vector<u8>,
        description: vector<u8>,
        url: vector<u8>,
        date: vector<u8>,
        ctx: &mut TxContext
    ): CoCoNFT {
        // let sender = tx_context::sender(ctx);
        let nft = CoCoNFT {
            id: object::new(ctx),
            name: string::utf8(name),
            description: string::utf8(description),
            url: url::new_unsafe_from_bytes(url),
            count: 1,
        };

        df::add(&mut nft.id, date_key(), vec_set::empty<String>());
        let date_set: &mut VecSet<String> = df::borrow_mut(&mut nft.id, date_key());
        vec_set::insert(date_set, string::utf8(date));
        // let customer : &mut VecSet<ID> = df::borrow_mut(&mut nft.id, date());
        // vec_set::insert(customer, tx_context::sender(&mut ctx));
        // dof::add(&mut nft.id, item(), CoCoItem { id: object::new(ctx) });
        nft
    }

    public fun add_item(
        // name: vector<u8>,
        // description: vector<u8>,
        url: vector<u8>,
        date: vector<u8>,
        ctx: &mut TxContext
    ): CoCoItem {
        let sender = tx_context::sender(ctx);
        let item = CoCoItem {
            id: object::new(ctx),
            // name: string::utf8(name),
            // description: string::utf8(description),
            url: url::new_unsafe_from_bytes(url),
        };
        item
    }

    public entry fun attend(
        name: vector<u8>,
        description: vector<u8>,
        url: vector<u8>,
        date: vector<u8 >,
        item_name: vector<u8 >,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let nft = new_nft(name, description, url, date, ctx);
        let item = add_item(item_name, date, ctx);
        event::emit(NFTMinted {
            object_id: object::id(&nft),
            creator: sender,
            name: nft.name,
        });
        dof::add(&mut nft.id, item_key(), item);
        transfer::public_transfer(nft, sender);
    }

    /// Transfer `nft` to `recipient`
    public entry fun transfer(
        nft: CoCoNFT, recipient: address, _: &mut TxContext
    ) {
        transfer::public_transfer(nft, recipient)
    }

    /// Update the `description` of `nft` to `new_description`
    public entry fun update_description(
        nft: &mut CoCoNFT,
        new_description: vector<u8>,
        _: &mut TxContext
    ) {
        nft.description = string::utf8(new_description)
    }

    /// Permanently delete `nft`
    public entry fun burn(nft: CoCoNFT, _: &mut TxContext) {
        let CoCoNFT { id, name: _, description: _, url: _ , count: _} = nft;
        object::delete(id)
    }
}

#[test_only]
module coco::nft_test {
    use coco::nft::{Self, CoCoNFT, new_nft, update_description, burn};
    use sui::test_scenario as ts;
    use sui::transfer;
    use std::string;

    #[test]
    fun mint_transfer_update() {
        let addr1 = @0xA;
        let addr2 = @0xB;
        // create the NFT
        let scenario = ts::begin(addr1);

        {
            new_nft(
                b"test",
                b"a test",
                b"https://www.sui.io",
                b"1",
                ts::ctx(&mut scenario)
            )
        };
        // send it from A to B
        ts::next_tx(&mut scenario, addr1);
        {
            let nft = ts::take_from_sender<CoCoNFT>(&mut scenario);
            transfer::public_transfer(nft, addr2);
        };
        // update its description
        ts::next_tx(&mut scenario, addr2);
        {
            let nft = ts::take_from_sender<CoCoNFT>(&mut scenario);
            update_description(&mut nft, b"a new description", ts::ctx(&mut scenario));
            assert!(*string::bytes(nft::description(&nft)) == b"a new description", 0);
            ts::return_to_sender(&mut scenario, nft);
        };
        // burn it
        ts::next_tx(&mut scenario, addr2);
        {
            let nft = ts::take_from_sender<CoCoNFT>(&mut scenario);
            burn(nft, ts::ctx(&mut scenario))
        };
        ts::end(scenario);
    }
}
