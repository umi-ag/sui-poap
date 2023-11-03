import {PUBLISHED_AT} from "..";
import {ObjectArg, obj, pure} from "../../_framework/util";
import {TransactionArgument, TransactionBlock} from "@mysten/sui.js/transactions";

export interface MintArgs { visitorList: ObjectArg; clock: ObjectArg; string1: string | TransactionArgument; string2: string | TransactionArgument; string3: string | TransactionArgument; string4: string | TransactionArgument }

export function mint( txb: TransactionBlock, args: MintArgs ) { return txb.moveCall({ target: `${PUBLISHED_AT}::issuer::mint`, arguments: [ obj(txb, args.visitorList), obj(txb, args.clock), pure(txb, args.string1, `0x1::string::String`), pure(txb, args.string2, `0x1::string::String`), pure(txb, args.string3, `0x1::string::String`), pure(txb, args.string4, `0x1::string::String`) ], }) }

export function countKey( txb: TransactionBlock, ) { return txb.moveCall({ target: `${PUBLISHED_AT}::issuer::count_key`, arguments: [ ], }) }

export function dateKey( txb: TransactionBlock, ) { return txb.moveCall({ target: `${PUBLISHED_AT}::issuer::date_key`, arguments: [ ], }) }

export interface CreateListArgs { string: string | TransactionArgument; u64: bigint | TransactionArgument }

export function createList( txb: TransactionBlock, args: CreateListArgs ) { return txb.moveCall({ target: `${PUBLISHED_AT}::issuer::create_list`, arguments: [ pure(txb, args.string, `0x1::string::String`), pure(txb, args.u64, `u64`) ], }) }
