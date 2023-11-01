module coco::issuer {
    use std::string::{utf8, String, Self};
    use std::vector::{Self};
    use sui::transfer;
    use sui::vec_set::{Self, VecSet};
    use sui::object::{Self, UID};
    use sui::dynamic_field as df;
    use sui::dynamic_object_field as dof;
    use sui::tx_context::{Self, TxContext};
    use sui::clock::{Self, Clock};

    const EExpiredAt: u64 = 1004;

    use coco::nft::{Self};

    fun count_key(): String {
        string::utf8(b"count")
    }

    fun date_key(): String {
        string::utf8(b"date_list")
    }

    struct VisitorList has key, store {
        id: UID,
        date: String,
        expired_at: u64,
        visitors: vec_set::VecSet<address>,
    }

    public entry fun create_list(
        date: String,
        expired_at: u64,
        ctx: &mut TxContext,
    ){
        let list = VisitorList {
            id: object::new(ctx),
            date: date,
            expired_at: expired_at,
            visitors: vec_set::empty<address>(),
        };
        transfer::public_share_object(list);
    }

    public entry fun mint(
        list: &mut VisitorList,
        clock: &Clock,
        name: String,
        description: String,
        img_url: String,
        date: String,
        ctx: &mut TxContext,
    ) {
        assert!(clock::timestamp_ms(clock) < list.expired_at, EExpiredAt);
        vec_set::insert(&mut list.visitors, tx_context::sender(ctx));
        let nft = nft::new(name, description, img_url, clock, ctx);
        df::add(nft::uid_mut_as_owner(&mut nft), count_key(), 1);
        df::add(nft::uid_mut_as_owner(&mut nft), date_key(), vec_set::singleton<String>(date));
        transfer::public_transfer(nft, tx_context::sender(ctx));
    }

}