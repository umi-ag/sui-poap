/// Example of an unlimited "Sui CoCoNFT" collection - anyone can
/// mint their CoCoNFT. Shows how to initialize the `Publisher` and how
/// to use it to get the `Display<CoCoNFT>` object - a way to describe a
/// type for the ecosystem.
module coco::nft {
    use std::string::{utf8, String, Self};
    use std::vector::{Self};
    use sui::transfer;
    use sui::vec_set::{Self, VecSet};
    use sui::object::{Self, UID};
    use sui::dynamic_field as df;
    use sui::dynamic_object_field as dof;
    use sui::tx_context::{Self, TxContext};
    use sui::clock::{Self, Clock};

    const EDoubleMint: u64 = 1001;
    const EExpiredAt: u64 = 1002;

    // The creator bundle: these two packages often go together.
    use sui::package;
    use sui::display;

    use coco::item;

    /// The CoCoNFT - an outstanding collection of digital art.
    struct CoCoNFT has key, store {
        id: UID,
        name: String,
        description: String,
        img_url: String,
    }

    struct VisitorList has key, store {
        id: UID,
        date: String,
        expired_at: u64,
        visitors: vec_set::VecSet<address>,
    }

    /// One-Time-Witness for the module.
    struct NFT has drop {}

    fun count_key(): String {
        string::utf8(b"count")
    }

    fun date_key(): String {
        string::utf8(b"date_list")
    }

    fun sender_key(): String {
        string::utf8(b"sender_address")
    }

    fun item_key(): String {
        string::utf8(b"item")
    }

    /// In the module initializer one claims the `Publisher` object
    /// to then create a `Display`. The `Display` is initialized with
    /// a set of fields (but can be modified later) and published via
    /// the `update_version` call.
    ///
    /// Keys and values are set in the initializer but could also be
    /// set after publishing if a `Publisher` object was created.
    fun init(otw: NFT, ctx: &mut TxContext) {
        let keys = vector[
            utf8(b"name"),
            utf8(b"link"),
            utf8(b"image_url"),
            utf8(b"description"),
            utf8(b"project_url"),
            utf8(b"creator"),
        ];

        let values = vector[
            // For `name` one can use the `CoCoNFT.name` property
            utf8(b"{name}"),
            // For `link` one can build a URL using an `id` property
            utf8(b"https://sui-heroes.io/hero/{id}"),

            utf8(b"{img_url}"),
            // Description is static for all `CoCoNFT` objects.
            utf8(b"A true CoCoNFT of the Sui ecosystem!"),
            // Project URL is usually static
            utf8(b"https://sui-heroes.io"),
            // Creator field can be any
            utf8(b"Unknown Sui Fan")
        ];

        // Claim the `Publisher` for the package!
        let publisher = package::claim(otw, ctx);

        // Get a new `Display` object for the `CoCoNFT` type.
        let display = display::new_with_fields<CoCoNFT>(
            &publisher, keys, values, ctx
        );

        // Commit first version of `Display` to apply changes.
        display::update_version(&mut display);

        transfer::public_transfer(publisher, tx_context::sender(ctx));
        transfer::public_transfer(display, tx_context::sender(ctx));
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

    /// Anyone can mint their `CoCoNFT`!
    public fun mint(
        list: &mut VisitorList,
        clock: &Clock,
        name: String,
        description: String,
        img_url: String,
        ctx: &mut TxContext,
    ): CoCoNFT {
        assert!(clock::timestamp_ms(clock) < list.expired_at, EExpiredAt);
        vec_set::insert(&mut list.visitors, tx_context::sender(ctx));
        let nft = CoCoNFT {
            id: object::new(ctx),
            name: name,
            description: description,
            img_url: img_url,
            // count: 1,
            // date: vec_set::empty<String>(),
        };
        df::add(&mut nft.id, count_key(), 1);
        df::add(&mut nft.id, date_key(), vec_set::empty<String>());
        df::add(&mut nft.id, sender_key(), tx_context::sender(ctx));
        nft
    }

    public entry fun first_mint(
        list: &mut VisitorList,
        clock: &Clock,
        name: String,
        description: String,
        url: String,
        date: String,
        ctx: &mut TxContext,
    ) {
        let nft = mint(list, clock, name, description, url, ctx);

        let date_set: &mut VecSet<String> = df::borrow_mut(&mut nft.id, date_key());
        vec_set::insert(date_set, date);

        transfer::public_transfer(nft, tx_context::sender(ctx));
    }

    public entry fun add_object(
        list: &mut VisitorList,
        nft: &mut CoCoNFT,
        date: String,
        item_name: String,
        item_description: String,
        item_url: String,
        ctx: &mut TxContext
    ) {
        let count: &mut u64 = df::borrow_mut(&mut nft.id, count_key());
        *count = *count + 1;
        let date_set: &mut VecSet<String> = df::borrow_mut(&mut nft.id, date_key());
        vec_set::insert(date_set, date);
        let item = item::new_item(item_name, item_description, item_url, date, ctx);
        dof::add(&mut nft.id, item_key(), item);
    }

}