/// Example of an unlimited "Sui CoCoItem" collection - anyone can
/// mint their CoCoItem. Shows how to initialize the `Publisher` and how
/// to use it to get the `Display<CoCoItem>` object - a way to describe a
/// type for the ecosystem.
module coco::item {
    use sui::tx_context::{sender, TxContext};
    use std::string::{utf8, String, Self};
    use sui::transfer;
    use sui::vec_set::{Self, VecSet};
    use sui::object::{Self, UID};
    use sui::dynamic_field as df;
    use sui::dynamic_object_field as dof;

    // The creator bundle: these two packages often go together.
    use sui::package;
    use sui::display;

    /// The CoCoItem - an outstanding collection of digital art.
    struct CoCoItem has key, store {
        id: UID,
        name: String,
        description: String,
        img_url: String,
        date: String,
    }

    /// One-Time-Witness for the module.
    struct ITEM has drop {}

    /// In the module initializer one claims the `Publisher` object
    /// to then create a `Display`. The `Display` is initialized with
    /// a set of fields (but can be modified later) and published via
    /// the `update_version` call.
    ///
    /// Keys and values are set in the initializer but could also be
    /// set after publishing if a `Publisher` object was created.
    fun init(otw: ITEM, ctx: &mut TxContext) {
        let keys = vector[
            utf8(b"name"),
            utf8(b"link"),
            utf8(b"image_url"),
            utf8(b"description"),
            utf8(b"project_url"),
            utf8(b"creator"),
        ];

        let values = vector[
            // For `name` one can use the `CoCoItem.name` property
            utf8(b"{name}"),
            // For `link` one can build a URL using an `id` property
            utf8(b"https://sui-heroes.io/hero/{id}"),

            utf8(b"{img_url}"),
            // Description is static for all `CoCoItem` objects.
            utf8(b"A true CoCoItem of the Sui ecosystem!"),
            // Project URL is usually static
            utf8(b"https://sui-heroes.io"),
            // Creator field can be any
            utf8(b"Unknown Sui Fan")
        ];

        // Claim the `Publisher` for the package!
        let publisher = package::claim(otw, ctx);

        // Get a new `Display` object for the `CoCoItem` type.
        let display = display::new_with_fields<CoCoItem>(
            &publisher, keys, values, ctx
        );

        // Commit first version of `Display` to apply changes.
        display::update_version(&mut display);

        transfer::public_transfer(publisher, sender(ctx));
        transfer::public_transfer(display, sender(ctx));
    }

    /// Anyone can mint their `CoCoItem`!
    public fun new_item(
        name: String,
        description: String,
        img_url: String,
        date: String,
        ctx: &mut TxContext,
    ): CoCoItem {
        let nft = CoCoItem {
            id: object::new(ctx),
            name: name,
            description: description,
            img_url: img_url,
            date: date,
        };
        nft
    }

}