import { rpcClient } from "typed-rpc";

// const shinamiAccountKey = "sui_mainnet_a3d005b4000b794b178162d50c7e2965";
const shinamiAccountKey = "sui_mainnet_e574df8c5c0d0ec4c5b170619a62ef49";
const shinamiProviderUrl = `https://api.shinami.com/gas/v1/${shinamiAccountKey}`;

const shinamiClient = rpcClient(shinamiProviderUrl);

const fetchSponsoredTransaction = async (
  payloadBytes: Uint8Array,
  userAddress: string
) => {
  console.log("## 1413", payloadBytes);

  const payloadBase64 = btoa(
    payloadBytes.reduce((data, byte) => data + String.fromCharCode(byte), "")
  );

  const GAS_BUDGET = 5e7;
  // @ts-ignore
  const sponsoredResponse = await shinamiClient.gas_sponsorTransactionBlock(
    payloadBase64,
    userAddress,
    GAS_BUDGET
  );
  const sponsoredStatus =
    // @ts-ignore
    await shinamiClient.gas_getSponsoredTransactionBlockStatus(
      sponsoredResponse.txDigest
    );
  console.log("Sponsorship Status:", sponsoredStatus);

  return sponsoredResponse;
};

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { payloadBytes: payloadBytesHex, userAddress } = await req.json();
  const payloadBytes = new Uint8Array(Buffer.from(payloadBytesHex, "hex"));

  const sponsoredResponse = await fetchSponsoredTransaction(
    payloadBytes,
    userAddress
  );

  return Response.json(sponsoredResponse);
}

export const runtime = "edge";
