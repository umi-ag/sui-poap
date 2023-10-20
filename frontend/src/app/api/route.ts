// export default async (req, res) => {
//   const NEXT_PUBLIC_GAS_ACCESS_KEY = process.env.NEXT_PUBLIC_GAS_ACCESS_KEY;

//   console.log({ NEXT_PUBLIC_GAS_ACCESS_KEY });

//   // const result = await someFunction(YOUR_VARIABLE);

//   res.status(200).json({ NEXT_PUBLIC_GAS_ACCESS_KEY });
// };

import { NextResponse } from "next/server";
import {
  Connection,
  Ed25519Keypair,
  JsonRpcProvider,
  RawSigner,
  TransactionBlock,
} from "@mysten/sui.js";
import { rpcClient } from "typed-rpc";
import type { SponsorRpc } from "@/types";

export async function GET() {
  // Shinami Gas Station endpoint:
  const SPONSOR_RPC_URL = `https://api.shinami.com/gas/v1/${process.env.NEXT_PUBLIC_GAS_ACCESS_KEY}`;
  console.log({ SPONSOR_RPC_URL });

  // Shinami Sui Node endpoint:
  const connection = new Connection({
    fullnode: `https://api.shinami.com/node/v1/${process.env.NEXT_PUBLIC_NODE_ACCESS_KEY}`,
  });

  const suiProvider = new JsonRpcProvider(connection);

  const proxy = (url: string) => "https://cors-proxy.fringe.zone/" + url;

  const SPONSOR_RPC_URL_PROXY = proxy(SPONSOR_RPC_URL);

  const sponsor = rpcClient<SponsorRpc>(SPONSOR_RPC_URL_PROXY);

  return NextResponse.json({
    provider: suiProvider,
    sponsor: sponsor,
  });
}
