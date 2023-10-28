import { PUBLISHED_AT } from "..";
import { ObjectArg, obj, pure } from "../../_framework/util";
import {
  TransactionArgument,
  TransactionBlock,
} from "@mysten/sui.js/transactions";

export interface MintArgs {
  string1: string | TransactionArgument;
  string2: string | TransactionArgument;
  string3: string | TransactionArgument;
}

export function mint(txb: TransactionBlock, args: MintArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::my_nft::mint`,
    arguments: [
      pure(txb, args.string1, `0x1::string::String`),
      pure(txb, args.string2, `0x1::string::String`),
      pure(txb, args.string3, `0x1::string::String`),
    ],
  });
}

export function init(txb: TransactionBlock, myNft: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::my_nft::init`,
    arguments: [obj(txb, myNft)],
  });
}

export function dateKey(txb: TransactionBlock) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::my_nft::date_key`,
    arguments: [],
  });
}

export function itemKey(txb: TransactionBlock) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::my_nft::item_key`,
    arguments: [],
  });
}

export interface FirstMintArgs {
  string1: string | TransactionArgument;
  string2: string | TransactionArgument;
  string3: string | TransactionArgument;
  string4: string | TransactionArgument;
  string5: string | TransactionArgument;
  string6: string | TransactionArgument;
  string7: string | TransactionArgument;
}

export function firstMint(txb: TransactionBlock, args: FirstMintArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::my_nft::first_mint`,
    arguments: [
      pure(txb, args.string1, `0x1::string::String`),
      pure(txb, args.string2, `0x1::string::String`),
      pure(txb, args.string3, `0x1::string::String`),
      pure(txb, args.string4, `0x1::string::String`),
      pure(txb, args.string5, `0x1::string::String`),
      pure(txb, args.string6, `0x1::string::String`),
      pure(txb, args.string7, `0x1::string::String`),
    ],
  });
}
