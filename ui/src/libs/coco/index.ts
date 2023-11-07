// import { SENDER_ADDRESS, GAS_BUDGET, sponsor, suiProvider } from "@/config/sui";
import {
  TransactionBlock,
  TransactionArgument,
} from "@mysten/sui.js/transactions";
import { PACKAGE_ID, EVENT_CONFIG_ID, CLOCK_ID, EVENT_KEY } from "src/config";

export interface MintArgs {
  // list: string | TransactionArgument;
  event_key: string | TransactionArgument;
  name: string | TransactionArgument;
  description: string | TransactionArgument;
  url: string | TransactionArgument;
}

export function firstMint(txb: TransactionBlock, args: MintArgs) {
  return txb.moveCall({
    target: `${PACKAGE_ID}::issuer::mint`,
    arguments: [
      txb.pure(EVENT_CONFIG_ID),
      txb.pure(CLOCK_ID),
      txb.pure(EVENT_KEY),
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

export interface EventArgs {
  // list: string | TransactionArgument;
  description: string | TransactionArgument;
  expired_at: number;
}

export function createEvent(txb: TransactionBlock, args: EventArgs) {
  return txb.moveCall({
    target: `${PACKAGE_ID}::issuer::create_event`,
    arguments: [
      txb.pure(EVENT_CONFIG_ID),
      txb.pure(EVENT_KEY),
      txb.pure(args.description),
      txb.pure(args.expired_at),
    ],
  });
}

export const moveCallCreateEvent = (
  txb: TransactionBlock,
  props: {
    description: string;
    expired_at: number;
  }
) => {
  createEvent(txb, {
    description: props.description,
    expired_at: props.expired_at,
  });
};
