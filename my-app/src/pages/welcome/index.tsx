"use client";

import { useLocalStorage } from 'usehooks-ts'
import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import { SerializedSignature } from "@mysten/sui.js/cryptography";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import {
  genAddressSeed,
  generateNonce,
  generateRandomness,
  getZkLoginSignature,
  jwtToAddress,
} from "@mysten/zklogin";
import { linkToExplorer } from "@polymedia/webutils";
import { decodeJwt } from "jose";
import { useEffect, useState } from "react";
import { Account, AccountData, OpenIdProvider, SetupData } from "src/types";
// import type { OpenIdProvider, SetupData, AccountData } from "@/types";
// import { moveCallMintNft } from "@/libs/movecall";
// import { SENDER_ADDRESS, GAS_BUDGET, sponsor, suiProvider } from "@/config/sui";

import config from "src/config/config.json";
import { GAS_BUDGET, sponsor } from "src/config/sui";
import { moveCallMintNft } from 'src/libs/coco';
import { useRouter } from 'next/navigation';
import { useZkLoginSetup } from 'src/store/zklogin';
import { fetchBalances } from 'src/libs/client';
import { moveCallSponsored } from 'src/libs/coco/sponsoredZkLogin';
const NETWORK = "mainnet";
const MAX_EPOCH = 1; // keep ephemeral keys active for this many Sui epochs from now (1 epoch ~= 24h)

const suiClient = new SuiClient({
  url: getFullnodeUrl(NETWORK),
});

/* Local storage keys */

const ZKLOGIN_SETUP = "zklogin-demo.setup";
const ZKLOGIN_ACCONTS = "zklogin-demo.accounts";

const Home = () => {
  const [balances, setBalances] = useState<Map<string, number>>(new Map()); // Map<Sui address, SUI balance>
  const [modalContent, setModalContent] = useState<string>("");
  const [account, setAccount] = useLocalStorage<Account | null>(ZKLOGIN_ACCONTS, null)
  const zkLoginSetup = useZkLoginSetup()
  const router = useRouter()

  useEffect(() => {
    if (account) {
      zkLoginSetup.completeZkLogin(account);
    }
  }, []);


  // https://docs.sui.io/build/zk_login#set-up-oauth-flow
  const beginZkLogin = async (provider: OpenIdProvider) => {
    setModalContent(`🔑 Logging in with ${provider}...`);

    await zkLoginSetup.beginZkLogin(provider)
    setAccount(zkLoginSetup.account())
    const loginUrl = zkLoginSetup.loginUrl();
    window.location.replace(loginUrl);
  }

  const openIdProviders: OpenIdProvider[] = ["Google", "Twitch", "Facebook"];
  return (
    <div id="page" className="min-h-screen bg-gray-100 p-8">
      <Modal content={modalContent} />
      <div id="network-indicator" className="mb-4">
        <label className="text-lg font-bold">{NETWORK}</label>
      </div>
      <h1 className="text-2xl font-bold mb-4">Sui zkLogin demo</h1>
      <div id="login-buttons" className="section mb-8">
        <h2 className="text-xl font-bold mb-2">Log in:</h2>
        {openIdProviders.map((provider) => (
          <button
            className={`btn-login text-black font-bold py-2 px-4 rounded border border-gray-300 ${provider}`}
            onClick={() => beginZkLogin(provider)}
            key={provider}
          >
            {provider}
          </button>
        ))}
      </div>
      <div>
        <button onClick={() => {
          console.log("click", zkLoginSetup.account())
        }}>
          dbg account
        </button>
        <button onClick={() => {
          console.log("click", zkLoginSetup.jwt)
        }}>
          dbg jwt
        </button>
      </div>
      <div>
        <button onClick={async () => {
          const r = await fetch('/api/hello?name=world')
          const d = await r.json()
          console.log({ d })
        }}>
          hello
        </button>
      </div>
      <div>
        <button onClick={async () => {
          const r = await fetch('/api/hi')
          const d = await r.json()
          console.log({ d })
        }}>
          hihi
        </button>
      </div>
      <div>
        <button onClick={async () => {
          const account = zkLoginSetup.account()
          console.log("account", account)
          const txb = new TransactionBlock()
          await moveCallSponsored(txb, account);
        }}>
          mint
        </button>
      </div>
      <div>
        <button onClick={async () => {
          const r = await fetch('/api/hello', {
            method: 'POST', // メソッドを指定
            headers: {
              'Content-Type': 'application/json', // コンテンツタイプを指定
            },
            body: JSON.stringify({
              key1: 'value1',
              key2: 'value2',
            }),
          })
          const d = await r.json()
          console.log({ d })
        }}>
          post
        </button>
      </div>
    </div>
  );
};

// Modal copied from https://github.com/juzybits/polymedia-timezones
const Modal: React.FC<{
  content: React.ReactNode;
}> = ({ content }) => {
  if (!content) {
    return null;
  }

  return (
    <div className="modal-background">
      <div className="modal-content">{content}</div>
    </div>
  );
};

export default Home;
