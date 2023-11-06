import { rpcClient } from "typed-rpc";

const shinamiProviderUrl = `https://api.shinami.com/gas/v1/${process.env.GAS_ACCESS_KEY}`;

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
  const sponsoredResponse = await (
    shinamiClient as any
  ).gas_sponsorTransactionBlock(payloadBase64, userAddress, GAS_BUDGET);
  const sponsoredStatus = await (
    shinamiClient as any
  ).gas_getSponsoredTransactionBlockStatus(sponsoredResponse.txDigest);
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
