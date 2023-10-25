
// import { SENDER_ADDRESS, GAS_BUDGET, sponsor, suiProvider } from "@/config/sui";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { GAS_BUDGET, SENDER_ADDRESS, sponsor, suiClient } from "src/config/sui";
import { firstMint } from "../moveCall/coco/my-nft/functions";
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

export const moveCallMintNft = async (txb: TransactionBlock, props: {
  origin_name: string;
  origin_description: string;
  origin_url: string;
  item_name: string;
  item_description: string;
  item_url: string;
  date: string;
}) => {
  firstMint(txb, {
    string1: props.origin_name,
    string2: props.origin_description,
    string3: props.origin_url,
    string4: props.item_name,
    string5: props.item_description,
    string6: props.item_url,
    string7: props.date,
  })
};

// const privateKeyBase64 = Buffer.from(
//   process.env.NEXT_PUBLIC_SENDER_PRIVATE_KEY!,
//   "hex"
// ).toString("base64");
// const keypair = Ed25519Keypair.fromSecretKey(fromB64(privateKeyBase64));
// const signer = new RawSigner(keypair, suiProvider);

// const keypair = buf ? Ed25519Keypair.fromSecretKey(buf.slice(1)) : undefined;

// export const sponsorTransactionE2E = async (suiProvider: any, sponsor: any) => {
export const sponsorTransactionE2E = async () => {
  const gaslessTxb = progTxnTransfer();

  const gaslessPayloadBytes = await gaslessTxb.build({
    provider: suiClient,
    onlyTransactionKind: true,
  });

  console.log({ gaslessPayloadBytes });

  const gaslessPayloadBase64 = btoa(
    gaslessPayloadBytes.reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ""
    )
  );

  console.log({ gaslessPayloadBase64 });

  const sponsoredResponse = await sponsor.gas_sponsorTransactionBlock(
    gaslessPayloadBase64,
    SENDER_ADDRESS,
    GAS_BUDGET,
  );

  console.log({ sponsoredResponse });

  const sponsoredStatus = await sponsor.gas_getSponsoredTransactionBlockStatus(
    sponsoredResponse.txDigest
  );
  console.log("Sponsorship Status:", sponsoredStatus);

  // const senderSig = await signer.signTransactionBlock({
  //   transactionBlock: TransactionBlock.from(sponsoredResponse.txBytes),
  // });

  return sponsoredResponse;
};
