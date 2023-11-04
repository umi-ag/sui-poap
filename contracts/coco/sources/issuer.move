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

    const EExpiredAt: u64 = 1001;

    use coco::nft::{Self};

    fun count_key(): String {
        string::utf8(b"count")
    }

    fun date_key(): String {
        string::utf8(b"date_list")
    }

    struct EventConfig has key, store {
        id: UID,
        description: String,
        expired_at: u64,
        visitors: vec_set::VecSet<address>,
    }

    public fun create_event(
        description: String,
        expired_at: u64,
        ctx: &mut TxContext,
    ){
        let event = EventConfig {
            id: object::new(ctx),
            description,
            expired_at,
            visitors: vec_set::empty<address>(),
        };
        transfer::public_share_object(event);
    }

    public fun mint(
        event: &mut EventConfig,
        clock: &Clock,
        name: String,
        description: String,
        img_url: String,
        date: String,
        ctx: &mut TxContext,
    ) {
        assert!(clock::timestamp_ms(clock) < event.expired_at, EExpiredAt);
        vec_set::insert(&mut event.visitors, tx_context::sender(ctx));
        let nft = nft::new(name, description, img_url, clock, ctx);
        df::add(nft::uid_mut_as_owner(&mut nft), count_key(), 1);
        df::add(nft::uid_mut_as_owner(&mut nft), date_key(), vec_set::singleton<String>(date));
        transfer::public_transfer(nft, tx_context::sender(ctx));
    }

}