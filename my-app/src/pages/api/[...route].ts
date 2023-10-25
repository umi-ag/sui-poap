import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { SponsorRpc } from 'src/types';
import { rpcClient } from 'typed-rpc';

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

  return sponsoredResponse
};


export const config = {
  runtime: 'edge'
}

const app = new Hono().basePath('/api')

app.post('/sponsor', async (c) => {
  const body = await c.req.json()

  console.log({ body })

  const sponsoredResponse = await fetchSponsoredTransaction(
    body.payloadBytes,
    body.userAddress,
  );
  return c.json(sponsoredResponse)
})

app.get('/hi', (c) => {
  return c.json({
    message: 'hi hi!',
  })
})

app.get('/hello', (c) => {
  const name = c.req.query('name')


  return c.json({
    message: 'Hello from Hono!',
    name,
  })
})

export default handle(app)
