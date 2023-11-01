import {PUBLISHED_AT} from "..";
import {ObjectArg, obj, pure} from "../../_framework/util";
import {TransactionArgument, TransactionBlock} from "@mysten/sui.js/transactions";

export interface NewArgs { string1: string | TransactionArgument; string2: string | TransactionArgument; string3: string | TransactionArgument; clock: ObjectArg }

export function new_( txb: TransactionBlock, args: NewArgs ) { return txb.moveCall({ target: `${PUBLISHED_AT}::nft::new`, arguments: [ pure(txb, args.string1, `0x1::string::String`), pure(txb, args.string2, `0x1::string::String`), pure(txb, args.string3, `0x1::string::String`), obj(txb, args.clock) ], }) }

export function init( txb: TransactionBlock, nft: ObjectArg ) { return txb.moveCall({ target: `${PUBLISHED_AT}::nft::init`, arguments: [ obj(txb, nft) ], }) }

export function uidMutAsOwner( txb: TransactionBlock, coCoNft: ObjectArg ) { return txb.moveCall({ target: `${PUBLISHED_AT}::nft::uid_mut_as_owner`, arguments: [ obj(txb, coCoNft) ], }) }
