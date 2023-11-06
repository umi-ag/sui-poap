// import { SENDER_ADDRESS, GAS_BUDGET, sponsor, suiProvider } from "@/config/sui";
import {
  TransactionBlock,
  TransactionArgument,
} from "@mysten/sui.js/transactions";
import { PACKAGE_ID, EVENT_CONFIG_ID, CLOCK_ID } from "src/config";

export interface FirstMintArgs {
  // list: string | TransactionArgument;
  event_key: string | TransactionArgument;
  name: string | TransactionArgument;
  description: string | TransactionArgument;
  url: string | TransactionArgument;
}

export function firstMint(txb: TransactionBlock, args: FirstMintArgs) {
  return txb.moveCall({
    target: `${PACKAGE_ID}::issuer::mint`,
    arguments: [
      txb.pure(EVENT_CONFIG_ID),
      txb.pure(CLOCK_ID),
      txb.pure(args.event_key),
      txb.pure(args.name),
      txb.pure(args.description),
      txb.pure(args.url),
    ],
  });
}

export const moveCallMintNft = (
  txb: TransactionBlock,
  props: {
    event_key: string;
    name: string;
    description: string;
    url: string;
  }
) => {
  firstMint(txb, {
    event_key: props.event_key,
    name: props.name,
    description: props.description,
    url: props.url,
  });
};
