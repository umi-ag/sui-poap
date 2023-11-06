import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";
import { rpcClient } from "typed-rpc";
import type { SponsorRpc } from "src/types";

// gas budget for our transactions, in MIST
// export const GAS_BUDGET = 5000000;
export const GAS_BUDGET = 123456789;

// Shinami Gas Station endpoint:
const SPONSOR_RPC_URL = `https://api.shinami.com/gas/v1/${process.env.NEXT_PUBLIC_GAS_ACCESS_KEY}`;

const proxy = (url: string) => "https://cors-proxy.fringe.zone/" + url;

const SPONSOR_RPC_URL_PROXY = proxy(SPONSOR_RPC_URL);

export const sponsor = rpcClient<SponsorRpc>(SPONSOR_RPC_URL_PROXY);

export const NETWORK = "testnet";

export const suiClient = new SuiClient({
  url: getFullnodeUrl(NETWORK),
});
