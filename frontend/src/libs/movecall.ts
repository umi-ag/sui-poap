import { TransactionBlock } from "@mysten/sui.js";
import { SENDER_ADDRESS, GAS_BUDGET, sponsor, suiProvider } from "@/config/sui";

// Create a programmable transaction block to send an object from the sender to the recipient
export const progTxnTransfer = () => {
  // The receiver of a transaction
  const RECIPIENT_ADDRESS =
    "0x3360bf32717508a4bd15e4e444ec602b9b534d6f31e5e4255bca30769f7bdba4";

  // For transferring objects transaction
  const OBJECT_TO_SEND =
    "0xa7012e5473a0938cf5116222191a99dd9207a01c4021fbeb96c726ea67a1ffe0";

  const txb = new TransactionBlock();

  txb.transferObjects(
    [txb.object(OBJECT_TO_SEND)],
    txb.pure(RECIPIENT_ADDRESS)
  );
  return txb;
};

// const privateKeyBase64 = Buffer.from(
//   process.env.NEXT_PUBLIC_SENDER_PRIVATE_KEY!,
//   "hex"
// ).toString("base64");
// const keypair = Ed25519Keypair.fromSecretKey(fromB64(privateKeyBase64));
// const signer = new RawSigner(keypair, suiProvider);

// const keypair = buf ? Ed25519Keypair.fromSecretKey(buf.slice(1)) : undefined;

export const sponsorTransactionE2E = async () => {
  const gaslessTxb = progTxnTransfer();

  const gaslessPayloadBytes = await gaslessTxb.build({
    provider: suiProvider,
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
    GAS_BUDGET
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
