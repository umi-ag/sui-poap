import {PUBLISHED_AT} from "..";
import {ObjectArg, obj, pure} from "../../_framework/util";
import {TransactionArgument, TransactionBlock} from "@mysten/sui.js/transactions";

export function init( txb: TransactionBlock, item: ObjectArg ) { return txb.moveCall({ target: `${PUBLISHED_AT}::item::init`, arguments: [ obj(txb, item) ], }) }

export interface NewItemArgs { string1: string | TransactionArgument; string2: string | TransactionArgument; string3: string | TransactionArgument; string4: string | TransactionArgument }

export function newItem( txb: TransactionBlock, args: NewItemArgs ) { return txb.moveCall({ target: `${PUBLISHED_AT}::item::new_item`, arguments: [ pure(txb, args.string1, `0x1::string::String`), pure(txb, args.string2, `0x1::string::String`), pure(txb, args.string3, `0x1::string::String`), pure(txb, args.string4, `0x1::string::String`) ], }) }
