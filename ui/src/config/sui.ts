import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";
import { rpcClient } from "typed-rpc";
import type { SponsorRpc } from "src/types";

// gas budget for our transactions, in MIST
// export const GAS_BUDGET = 5000000;
export const GAS_BUDGET = 123456789;

export const NETWORK = "testnet";

export const suiClient = new SuiClient({
  url: getFullnodeUrl(NETWORK),
});
