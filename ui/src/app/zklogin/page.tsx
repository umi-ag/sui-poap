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
import { AccountData, OpenIdProvider, SetupData } from "src/types";
// import type { OpenIdProvider, SetupData, AccountData } from "@/types";
// import { moveCallMintNft } from "@/libs/movecall";
// import { SENDER_ADDRESS, GAS_BUDGET, sponsor, suiProvider } from "@/config/sui";

import config from "src/config/config.json";
import { GAS_BUDGET, sponsor } from "src/config/sui";
import { moveCallMintNft } from 'src/libs/coco';
import { useRouter } from 'next/navigation';
import { completeZkLogin, useZkLoginSetup } from 'src/store/zklogin';
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
  const [accounts, setAccounts] = useLocalStorage<AccountData[]>(ZKLOGIN_ACCONTS, [])
  const zkLoginSetup = useZkLoginSetup()

  const router = useRouter()

  /* HTML */

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

function shortenAddress(address: string): string {
  return "0x" + address.slice(2, 8) + "..." + address.slice(-6);
}

export default Home;
