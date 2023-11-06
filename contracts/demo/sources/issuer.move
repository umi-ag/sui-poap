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

    struct EventConfig has key, store {
        id: UID,
        description: String,
    }

    struct Event has key, store {
        id: UID,
        description: String,
        expired_at: u64,
        visitors: vector<address>,
    }

    fun init(ctx: &mut TxContext) {
        transfer::share_object(EventConfig{
            id: object::new(ctx),
            description: string::utf8(b"Sui Japn Meetup Event")
        })
    }

    public entry fun create_event(
        config: &mut EventConfig,
        event_key: String,
        description: String,
        expired_at: u64,
        ctx: &mut TxContext,
    ){
        let event = Event {
            id: object::new(ctx),
            description,
            expired_at,
            visitors: vector::empty(),
        };
        dof::add(&mut config.id, event_key, event);
    }

    public entry fun mint(
        config: &mut EventConfig,
        clock: &Clock,
        event_key: String,
        name: String,
        description: String,
        img_url: String,
        ctx: &mut TxContext,
    ) {
        let event: &mut Event = dof::borrow_mut(&mut config.id, event_key);
        assert!(clock::timestamp_ms(clock) < event.expired_at, EExpiredAt);
        vector::push_back(&mut event.visitors, tx_context::sender(ctx));
        let nft = nft::new(name, description, img_url, clock, ctx);
        transfer::public_transfer(nft, tx_context::sender(ctx));
    }

}