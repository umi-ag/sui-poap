import destr from "destr";
import { readFileSync } from "fs";
import path from "path";
import { rpcClient } from "typed-rpc";
import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { genAddressSeed, getZkLoginSignature } from "@mysten/zklogin";
import { SerializedSignature } from "@mysten/sui.js/cryptography";
import { Account, SponsorRpc } from "src/types";
import { moveCallMintNft } from ".";
import { suiClient } from "src/config/sui";

// /api.shinami.com/gas/v1/sui_mainnet_a3d005b4000b794b178162d50c7e2965
const shinamiAccountKey = "sui_mainnet_a3d005b4000b794b178162d50c7e2965";
const shinamiProviderUrl =
  `https://api.shinami.com/gas/v1/${shinamiAccountKey}`;
const shinamiClient = rpcClient<SponsorRpc>(shinamiProviderUrl);

const fetchSponsoredTransaction = async (
  payloadBytes: Uint8Array,
  userAddress: string,
) => {
  const payloadBase64 = btoa(
    payloadBytes.reduce((data, byte) => data + String.fromCharCode(byte), ""),
  );

  const GAS_BUDGET = 5e7;
  const sponsoredResponse = await shinamiClient.gas_sponsorTransactionBlock(
    payloadBase64,
    userAddress,
    GAS_BUDGET,
  );
  const sponsoredStatus = await shinamiClient
    .gas_getSponsoredTransactionBlockStatus(
      sponsoredResponse.txDigest,
    );
  console.log("Sponsorship Status:", sponsoredStatus);

  // consola.info("Sponsored Response:", JSON.stringify(sponsoredResponse, null, 2));

  return sponsoredResponse;
};

export const moveCallSponsored = async (
  txb: TransactionBlock,
  account: Account,
) => {
  txb.setSender(account.userAddr);
  moveCallMintNft(txb, {
    origin_name: "takaya",
    origin_description: "takaya's icon",
    origin_url:
      "https://pbs.twimg.com/profile_images/1538981748478214144/EUjTgb0v_400x400.jpg",
    item_name: "imataka",
    item_description: "hey",
    item_url:
      "https://toy.bandai.co.jp/assets/tamagotchi/images/chopper/img_chara01.png",
    date: "2023/10/30",
  });
  const payloadBytes = await txb.build({
    client: suiClient,
    onlyTransactionKind: true,
  });

  // const sponsoredResponse = await fetch("/api/sponsor", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     payloadBytes,
  //     userAddress: account.userAddr,
  //   }),
  // });

  const sponsoredResponse  = await fetchSponsoredTransaction(
    payloadBytes,
    account.userAddr,
  );

  alert("##1");
  console.log("sponsoredResponse", sponsoredResponse);
  alert("##2");


  // ★ shinamiから受け取ったtxBytesからTransactionBlockを作成
  // @ts-ignore
  const gaslessTxb = TransactionBlock.from(sponsoredResponse.txBytes);

  const ephemeralKeyPair = Ed25519Keypair.fromSecretKey(
    Buffer.from(account.ephemeralPrivateKey, "base64"),
  );
  const { bytes, signature: userSignature } = await gaslessTxb.sign({
    client: suiClient,
    signer: ephemeralKeyPair,
  });

  const addressSeed = genAddressSeed(
    BigInt(account.userSalt),
    "sub",
    account.sub,
    account.aud,
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
    // @ts-ignore
    signature: [zkLoginSignature, sponsoredResponse.signature],
    requestType: "WaitForLocalExecution",
    options: {
      showEffects: true,
    },
  });

  console.log("r", r);
};
