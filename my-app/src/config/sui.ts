import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";
import { rpcClient } from "typed-rpc";
import type { SponsorRpc } from "src/types";
import { buildGaslessTransactionBytes, createSuiClient } from "shinami";

// gas budget for our transactions, in MIST
// export const GAS_BUDGET = 5000000;
export const GAS_BUDGET = 123456789;

// The sui address of the initiator of the transaction
export const SENDER_ADDRESS =
  // "0xe1381ac24d75d5d5a033202ae276e0489b65934b3f7f5f0e39b0fb31de155b6c";
  "0xfe5877ace271d2bd5446d868939dc64dd69d9326930cc556cdd15a158fd9943d";

// Shinami Gas Station endpoint:
const SPONSOR_RPC_URL =
  `https://api.shinami.com/gas/v1/${process.env.NEXT_PUBLIC_GAS_ACCESS_KEY}`;
console.log({ SPONSOR_RPC_URL });

// // Shinami Sui Node endpointu
// const connection = new Connection({
//   fullnode: `https://api.shinami.com/node/v1/${process.env.NEXT_PUBLIC_NODE_ACCESS_KEY}`,
// });

// export const suiProvider = new JsonRpcProvider(connection);

const proxy = (url: string) => "https://cors-proxy.fringe.zone/" + url;

const SPONSOR_RPC_URL_PROXY = proxy(SPONSOR_RPC_URL);

export const sponsor = rpcClient<SponsorRpc>(SPONSOR_RPC_URL_PROXY);
// export const sponsor = createSuiClient(
//   process.env.NEXT_PUBLIC_GAS_ACCESS_KEY!
// );

export const NETWORK = "mainnet";

export const suiClient = new SuiClient({
  url: getFullnodeUrl(NETWORK),
});

// export const suiClient = () => {
//   return new SuiClient({
//     url: "https://fullnode.testnet.sui.io:443",
//   });
// };
