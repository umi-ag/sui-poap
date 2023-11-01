// import { SENDER_ADDRESS, GAS_BUDGET, sponsor, suiProvider } from "@/config/sui";
import {
  TransactionBlock,
  TransactionArgument,
} from "@mysten/sui.js/transactions";
import { GAS_BUDGET, SENDER_ADDRESS, sponsor, suiClient } from "src/config/sui";
// import { firstMint } from "../moveCall/coco/my-nft/functions";
import { PACKAGE_ID, VISITOR_LIST_ID, CLOCK_ID } from "src/config";
// import { SENDER_ADDRESS, GAS_BUDGET } from "@/config/sui";

// Create a programmable transaction block to send an object from the sender to the recipient
export const progTxnTransfer = () => {
  // The receiver of a transaction
  const RECIPIENT_ADDRESS =
    "0x3360bf32717508a4bd15e4e444ec602b9b534d6f31e5e4255bca30769f7bdba4";

  // For transferring objects transaction
  const OBJECT_TO_SEND =
    "0x976affdc1334871709082aedb1d2f84d6d1e33974ecbe33f11ad15be5ead7660";

  const txb = new TransactionBlock();

  txb.transferObjects(
    [txb.object(OBJECT_TO_SEND)],
    txb.pure(RECIPIENT_ADDRESS)
  );
  return txb;
};

export interface FirstMintArgs {
  // list: string | TransactionArgument;
  name: string | TransactionArgument;
  description: string | TransactionArgument;
  url: string | TransactionArgument;
  date: string | TransactionArgument;
}

export function firstMint(txb: TransactionBlock, args: FirstMintArgs) {
  return txb.moveCall({
    target: `${PACKAGE_ID}::nft::first_mint`,
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

// const privateKeyBase64 = Buffer.from(
//   process.env.NEXT_PUBLIC_SENDER_PRIVATE_KEY!,
//   "hex"
// ).toString("base64");
// const keypair = Ed25519Keypair.fromSecretKey(fromB64(privateKeyBase64));
// const signer = new RawSigner(keypair, suiProvider);

// const keypair = buf ? Ed25519Keypair.fromSecretKey(buf.slice(1)) : undefined;
