// import { SENDER_ADDRESS, GAS_BUDGET, sponsor, suiProvider } from "@/config/sui";
import {
  TransactionBlock,
  TransactionArgument,
} from "@mysten/sui.js/transactions";
import { PACKAGE_ID, VISITOR_LIST_ID, CLOCK_ID } from "src/config";

export interface FirstMintArgs {
  // list: string | TransactionArgument;
  name: string | TransactionArgument;
  description: string | TransactionArgument;
  url: string | TransactionArgument;
  date: string | TransactionArgument;
}

export function firstMint(txb: TransactionBlock, args: FirstMintArgs) {
  return txb.moveCall({
    target: `${PACKAGE_ID}::issuer::mint`,
    arguments: [
      txb.pure(VISITOR_LIST_ID),
      txb.pure(CLOCK_ID),
      txb.pure(args.name),
      txb.pure(args.description),
      txb.pure(args.url),
      txb.pure(args.date),
    ],
  });
}

export const moveCallMintNft = (
  txb: TransactionBlock,
  props: {
    name: string;
    description: string;
    url: string;
    date: string;
  }
) => {
  firstMint(txb, {
    name: props.name,
    description: props.description,
    url: props.url,
    date: props.date,
  });
};
