"use client";

import { useLocalStorage } from "usehooks-ts";
import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { MouseEventHandler, ReactNode, useEffect, useState } from "react";
import { Account, OpenIdProvider } from "src/types";
// import type { OpenIdProvider, SetupData, AccountData } from "@/types";
// import { moveCallMintNft } from "@/libs/movecall";
// import { SENDER_ADDRESS, GAS_BUDGET, sponsor, suiProvider } from "@/config/sui";

import { useRouter } from "next/navigation";
import { useZkLoginSetup } from "src/store/zklogin";
import { moveCallSponsored } from "src/libs/coco/sponsoredZkLogin";
import { NETWORK } from "src/config/sui";
const MAX_EPOCH = 1; // keep ephemeral keys active for this many Sui epochs from now (1 epoch ~= 24h)

const suiClient = new SuiClient({
  url: getFullnodeUrl(NETWORK),
});

/* Local storage keys */

const ZKLOGIN_SETUP = "zklogin-demo.setup";
const ZKLOGIN_ACCONTS = "zklogin-demo.accounts";

const Button = ({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick: MouseEventHandler;
  disabled?: boolean;
}) => (
  <button
    className="btn-login text-black font-bold py-2 px-4 rounded border border-gray-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

const Home = () => {
  const [balances, setBalances] = useState<Map<string, number>>(new Map()); // Map<Sui address, SUI balance>
  const [modalContent, setModalContent] = useState<string>("");
  const [account, setAccount] = useLocalStorage<Account | null>(
    ZKLOGIN_ACCONTS,
    null
  );
  const zkLoginSetup = useZkLoginSetup();
  const router = useRouter();
  const [digest, setDigest] = useState<string>("");

  useEffect(() => {
    if (account) {
      zkLoginSetup.completeZkLogin(account);
    }
  }, []);

  // https://docs.sui.io/build/zk_login#set-up-oauth-flow
  const beginZkLogin = async (provider: OpenIdProvider) => {
    setModalContent(`🔑 Logging in with ${provider}...`);

    await zkLoginSetup.beginZkLogin(provider);
    setAccount(zkLoginSetup.account());
    const loginUrl = zkLoginSetup.loginUrl();
    window.location.replace(loginUrl);
  };

  const openIdProviders: OpenIdProvider[] = [
    "Google",
    // "Twitch",
    // "Facebook",
  ];

  const status = () => {
    if (!zkLoginSetup.jwt) {
      return "Not signed in";
    }

    if (!zkLoginSetup.zkProofs && zkLoginSetup.isProofsLoading) {
      return "Loading zk proofs...";
    }

    return "Ready!";
  };

  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div id="page" className="min-h-screen bg-gray-100 p-8">
      <Modal content={modalContent} />
      <div id="network-indicator" className="mb-4">
        <label className="text-lg font-bold">{NETWORK}</label>
      </div>
      <h1 className="text-2xl font-bold mb-4">Sui zkLogin demo</h1>
      <div id="login-buttons" className="section mb-8">
        {/* <h2 className="text-xl font-bold mb-2">Log in:</h2> */}
        {openIdProviders.map((provider) => (
          <button
            className={`btn-login text-black font-bold py-2 px-4 rounded border border-gray-300 ${provider}`}
            onClick={() => beginZkLogin(provider)}
            key={provider}
          >
            Log in with {provider}
          </button>
        ))}
      </div>

      <p className="mb-2">
        zkLogin Address:{" "}
        {zkLoginSetup.userAddr && (
          <b>
            <a
              className="text-blue-400 underline"
              href={`https://suiscan.xyz/mainnet/account/${zkLoginSetup.userAddr}/tx-blocks`}
            >
              {shortenAddress(zkLoginSetup.userAddr)}
            </a>
          </b>
        )}
      </p>
      <p className="mb-4">
        Current Status: <b>{status()}</b>
      </p>

      <div>
        <Button
          onClick={async () => {
            const account = zkLoginSetup.account();
            console.log("account", account);
            const txb = new TransactionBlock();
            const digest = await moveCallSponsored(txb, account);
            setDigest(digest);
          }}
          disabled={!zkLoginSetup.zkProofs}
        >
          mint
        </Button>

        <p className="mt-2">
          <a
            className="text-blue-400 underline"
            href={`https://suiscan.xyz/mainnet/tx/${digest}`}
          >
            {digest}
          </a>
        </p>
      </div>
      <hr className="my-8 border-slate-300" />
      <div className="flex gap-4">
        <Button
          onClick={() => {
            console.log("click", zkLoginSetup.account());
          }}
        >
          dbg account
        </Button>
        <Button
          onClick={() => {
            console.log("click", zkLoginSetup.jwt);
          }}
        >
          dbg jwt
        </Button>
        <Button
          onClick={async () => {
            const r = await fetch("/api/hello?name=world");
            const d = await r.json();
            console.log({ d });
          }}
        >
          hello
        </Button>
        <Button
          onClick={async () => {
            const r = await fetch("/api/hi");
            const d = await r.json();
            console.log({ d });
          }}
        >
          hihi
        </Button>
        <Button
          onClick={async () => {
            const r = await fetch("/api/hello", {
              method: "POST", // メソッドを指定
              headers: {
                "Content-Type": "application/json", // コンテンツタイプを指定
              },
              body: JSON.stringify({
                key1: "value1",
                key2: "value2",
              }),
            });
            const d = await r.json();
            console.log({ d });
          }}
        >
          post
        </Button>
        <Button
          onClick={() => {
            localStorage.removeItem(ZKLOGIN_ACCONTS);
            window.location.reload();
          }}
        >
          clear account
        </Button>
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
