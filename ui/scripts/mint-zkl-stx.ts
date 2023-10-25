import destr from "destr";
import { readFileSync } from "fs";
import path from "path";
import { Account } from "./type";
import { SponsorRpc } from "./type";
import { rpcClient } from "typed-rpc";
import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { genAddressSeed, getZkLoginSignature } from "@mysten/zklogin";
import { SerializedSignature } from "@mysten/sui.js/cryptography";

const jsonPath = path.resolve(import.meta.dir, "../account.json");
const json = readFileSync(jsonPath, "utf8");
const account = destr<Account>(json);

const shinamiAccountKey = "sui_mainnet_2d5f260d7d5742c5c4b9e63c9b08af8c";
const shinamiProviderUrl = `https://api.shinami.com/gas/v1/${shinamiAccountKey}`;
const shinamiClient = rpcClient<SponsorRpc>(shinamiProviderUrl);

const suiClient = new SuiClient({
  url: getFullnodeUrl("mainnet"),
});

const txb = new TransactionBlock();
txb.setSender(account.userAddr);

const packageId =
  "0x26d4185cbe7c41df3e1ea83bea4a5b33643717c651b69e325eeae85ca423ea72";
txb.moveCall({
  target: `${packageId}::my_nft::first_mint`,
  arguments: [
    txb.pure('takaya'),
    txb.pure('takaya\'s icon'),
    txb.pure('https://pbs.twimg.com/profile_images/1538981748478214144/EUjTgb0v_400x400.jpg'),
    txb.pure('imataka'),
    txb.pure('hey'),
    txb.pure('https://toy.bandai.co.jp/assets/tamagotchi/images/chopper/img_chara01.png'),
    txb.pure('2023/10/30'),
  ],
});

const payloadBytes = await txb.build({
  client: suiClient,
  onlyTransactionKind: true,
});
const payloadBase64 = btoa(
  payloadBytes.reduce((data, byte) => data + String.fromCharCode(byte), "")
);

const GAS_BUDGET = 5e7;
const sponsoredResponse = await shinamiClient.gas_sponsorTransactionBlock(
  payloadBase64,
  account.userAddr,
  GAS_BUDGET
);
// consola.info("Sponsored Response:", JSON.stringify(sponsoredResponse, null, 2));

const sponsoredStatus =
  await shinamiClient.gas_getSponsoredTransactionBlockStatus(
    sponsoredResponse.txDigest
  );
console.log("Sponsorship Status:", sponsoredStatus);

// ★ shinamiから受け取ったtxBytesからTransactionBlockを作成
const gaslessTxb = TransactionBlock.from(sponsoredResponse.txBytes);

const ephemeralKeyPair = Ed25519Keypair.fromSecretKey(
  Buffer.from(account.ephemeralPrivateKey, "base64")
);
const { bytes, signature: userSignature } = await gaslessTxb.sign({
  client: suiClient,
  signer: ephemeralKeyPair,
});

const addressSeed = genAddressSeed(
  BigInt(account.userSalt),
  "sub",
  account.sub,
  account.aud
).toString();

// Serialize the zkLogin signature by combining the ZK proof (inputs), the maxEpoch,
// and the ephemeral signature (userSignature).
const zkLoginSignature: SerializedSignature = getZkLoginSignature({
  inputs: {
    ...account.zkProofs,
    addressSeed,
  },
  maxEpoch: account.maxEpoch,
  userSignature,
});

// Execute the transaction
const r = await suiClient.executeTransactionBlock({
  transactionBlock: bytes,
  signature: [zkLoginSignature, sponsoredResponse.signature],
  requestType: "WaitForLocalExecution",
  options: {
    showEffects: true,
  },
});

console.log("r", r);
