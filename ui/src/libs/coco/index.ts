// import { SENDER_ADDRESS, GAS_BUDGET, sponsor, suiProvider } from "@/config/sui";
import {
  TransactionBlock,
  TransactionArgument,
} from "@mysten/sui.js/transactions";
import {
  EVENT_PACKAGE_ID,
  EVENT_VISITOR_LIST_ID,
  CLOCK_ID,
  DEMO_PACKAGE_ID,
  DEMO_VISITOR_LIST_ID,
} from "src/config";

export interface FirstMintArgs {
  // list: string | TransactionArgument;
  name: string | TransactionArgument;
  description: string | TransactionArgument;
  url: string | TransactionArgument;
  date: string | TransactionArgument;
}

export function firstMint(
  txb: TransactionBlock,
  args: FirstMintArgs,
  isEvent: boolean
) {
  return txb.moveCall({
    target: isEvent
      ? `${EVENT_PACKAGE_ID}::nft::first_mint`
      : `${DEMO_PACKAGE_ID}::issuer::mint`,
    arguments: [
      isEvent
        ? txb.pure(EVENT_VISITOR_LIST_ID)
        : txb.pure(DEMO_VISITOR_LIST_ID),
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
  },
  isEvent: boolean
) => {
  firstMint(
    txb,
    {
      name: props.name,
      description: props.description,
      url: props.url,
      date: props.date,
    },
    isEvent
  );
};
