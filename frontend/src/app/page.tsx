"use client";

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
import { toBigIntBE } from "bigint-buffer";
import { decodeJwt } from "jose";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
// import "./App.less";

/* Configuration */

import config from "./config.json"; // copy and modify config.example.json with your own values

const NETWORK = "devnet";
const MAX_EPOCH = 2; // keep ephemeral keys active for this many Sui epochs from now (1 epoch ~= 24h)

const suiClient = new SuiClient({
  url: getFullnodeUrl(NETWORK),
});

/* Local storage keys */

const setupDataKey = "zklogin-demo.setup";
const accountDataKey = "zklogin-demo.accounts";

/* Types */

type OpenIdProvider = "Google" | "Twitch" | "Facebook";

type SetupData = {
  provider: OpenIdProvider;
  maxEpoch: number;
  randomness: string;
  ephemeralPublicKey: string;
  ephemeralPrivateKey: string;
};

type AccountData = {
  provider: OpenIdProvider;
  userAddr: string;
  zkProofs: any; // TODO: add type
  ephemeralPublicKey: string;
  ephemeralPrivateKey: string;
  userSalt: string;
  sub: string;
  aud: string;
  maxEpoch: number;
};

export const Home = () => {
  const accounts = useRef<AccountData[]>(loadAccounts()); // useRef() instead of useState() because of setInterval()
  const [balances, setBalances] = useState<Map<string, number>>(new Map()); // Map<Sui address, SUI balance>
  const [modalContent, setModalContent] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    completeZkLogin();

    fetchBalances(accounts.current);
    const interval = setInterval(() => fetchBalances(accounts.current), 6_000);
    return () => clearInterval(interval);
  }, []);

  /* zkLogin logic */

  // https://docs.sui.io/build/zk_login#set-up-oauth-flow
  async function beginZkLogin(provider: OpenIdProvider) {
    setModalContent(`🔑 Logging in with ${provider}...`);

    // Create a nonce
    const { epoch } = await suiClient.getLatestSuiSystemState();
    const maxEpoch = Number(epoch) + MAX_EPOCH; // the ephemeral key will be valid for MAX_EPOCH from now
    const randomness = generateRandomness();
    const ephemeralKeyPair = new Ed25519Keypair();
    const nonce = generateNonce(
      ephemeralKeyPair.getPublicKey(),
      maxEpoch,
      randomness
    );

    // Save data to local storage so completeZkLogin() can use it after the redirect
    saveSetupData({
      provider,
      maxEpoch,
      randomness: randomness.toString(),
      ephemeralPublicKey: toBigIntBE(
        Buffer.from(ephemeralKeyPair.getPublicKey().toSuiBytes())
      ).toString(),
      ephemeralPrivateKey: ephemeralKeyPair.export().privateKey,
    });

    const REDIRECT_URI = window.location.origin;

    // Start the OAuth flow with the OpenID provider
    const urlParamsBase = {
      nonce: nonce,
      state: new URLSearchParams({
        redirect_uri: REDIRECT_URI,
      }).toString(),
      //   redirect_uri: window.location.origin + "/login",
      redirect_uri: "https://zklogin-dev-redirect.vercel.app/api/auth",
      response_type: "id_token",
      scope: "openid",
    };
    let loginUrl: string;
    switch (provider) {
      case "Google": {
        const urlParams = new URLSearchParams({
          ...urlParamsBase,
          client_id: config.CLIENT_ID_GOOGLE,
        });
        loginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${urlParams}`;
        break;
      }
      case "Twitch": {
        const urlParams = new URLSearchParams({
          ...urlParamsBase,
          client_id: config.CLIENT_ID_TWITCH,
          force_verify: "true",
          lang: "en",
          login_type: "login",
        });
        loginUrl = `https://id.twitch.tv/oauth2/authorize?${urlParams}`;
        break;
      }
      case "Facebook": {
        const urlParams = new URLSearchParams({
          ...urlParamsBase,
          client_id: config.CLIENT_ID_FACEBOOK,
        });
        loginUrl = `https://www.facebook.com/v18.0/dialog/oauth?${urlParams}`;
        break;
      }
    }
    window.location.replace(loginUrl);
  }

  async function completeZkLogin() {
    // Validate the JWT
    // https://docs.sui.io/build/zk_login#decoding-jwt
    const urlFragment = window.location.hash.substring(1);
    const urlParams = new URLSearchParams(urlFragment);
    const jwt = urlParams.get("id_token");
    if (!jwt) {
      return;
    }
    window.history.replaceState(null, "", window.location.pathname); // remove URL fragment
    const jwtPayload = decodeJwt(jwt);
    if (!jwtPayload.sub || !jwtPayload.aud) {
      console.warn("[completeZkLogin] missing jwt.sub or jwt.aud");
      return;
    }

    // Get a Sui address for the user
    // https://docs.sui.io/build/zk_login#user-salt-management
    // https://docs.sui.io/build/zk_login#get-the-users-sui-address
    // const saltResponse: any = await fetch(proxy(config.URL_SALT_SERVICE), {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ jwt }),
    // })
    //   .then((res) => {
    //     console.debug("[completeZkLogin] salt service success");
    //     return res.json();
    //   })
    //   .catch((error) => {
    //     console.warn("[completeZkLogin] salt service error:", error);
    //     return null;
    //   });
    // if (!saltResponse) {
    //   return;
    // }
    // const userSalt = BigInt(saltResponse.salt);
    const userSalt = "";
    const userAddr = jwtToAddress(jwt, userSalt);

    // Load and clear data from local storage which beginZkLogin() created before the redirect
    const setupData = loadSetupData();
    if (!setupData) {
      console.warn("[completeZkLogin] missing local storage data");
      return;
    }
    clearSetupData();
    for (const account of accounts.current) {
      if (userAddr === account.userAddr) {
        console.warn(
          `[completeZkLogin] already logged in with this ${setupData.provider} account`
        ); // TODO: replace old with new
        return;
      }
    }

    const payloadObject = {
      maxEpoch: setupData.maxEpoch,
      jwtRandomness: setupData.randomness,
      extendedEphemeralPublicKey: setupData.ephemeralPublicKey,
      jwt,
      salt: userSalt.toString(),
      keyClaimName: "sub",
    };

    const payload = JSON.stringify(payloadObject);

    console.log({ payload });
    console.log(config.URL_ZK_PROVER);

    console.debug("[completeZkLogin] Requesting ZK proof with:", payload);

    async function sendRequest() {
      const url = "https://prover.umilabs.org/v1";
      const headers = {
        "Content-Type": "application/json",
      };
      const body = payload;

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: headers,
          body: body,
        });
        const zkProofs = await response.json();
        console.log(zkProofs);

        saveAccount({
          provider: setupData.provider,
          userAddr,
          zkProofs,
          ephemeralPublicKey: setupData.ephemeralPublicKey,
          ephemeralPrivateKey: setupData.ephemeralPrivateKey,
          userSalt: userSalt.toString(),
          sub: jwtPayload.sub,
          aud:
            typeof jwtPayload.aud === "string"
              ? jwtPayload.aud
              : jwtPayload.aud[0],
          maxEpoch: setupData.maxEpoch,
        });
        router.push("/account");
      } catch (error) {
        console.error("Error:", error);
        return;
      }
    }

    sendRequest();
  }

  // Assemble a zkLogin signature and submit a transaction
  // https://docs.sui.io/build/zk_login#assemble-the-zklogin-signature-and-submit-the-transaction
  async function sendTransaction(account: AccountData) {
    setModalContent("🚀 Sending transaction...");

    // Sign the transaction bytes with the ephemeral private key.
    const txb = new TransactionBlock();
    txb.setSender(account.userAddr);
    const ephemeralKeyPair = Ed25519Keypair.fromSecretKey(
      Buffer.from(account.ephemeralPrivateKey, "base64")
    );
    const { bytes, signature: userSignature } = await txb.sign({
      client: suiClient,
      signer: ephemeralKeyPair,
    });

    // Generate an address seed by combining userSalt, sub (subject ID), and aud (audience).
    const addressSeed = genAddressSeed(
      BigInt(account.userSalt),
      "sub",
      account.sub,
      account.aud
    ).toString();

    console.log(account.zkProofs);

    // Serialize the zkLogin signature by combining the ZK proof (inputs), the maxEpoch,
    // and the ephemeral signature (userSignature).
    const zkLoginSignature: SerializedSignature = getZkLoginSignature({
      inputs: {
        ...account.zkProofs,
        addressSeed,
      },
      maxEpoch: account.maxEpoch,
      userSignature,
    });

    // Execute the transaction
    await suiClient
      .executeTransactionBlock({
        transactionBlock: bytes,
        signature: zkLoginSignature,
        options: {
          showEffects: true,
        },
      })
      .then((result) => {
        console.debug(
          "[sendTransaction] executeTransactionBlock response:",
          result
        );
        fetchBalances([account]);
      })
      .catch((error) => {
        console.warn(
          "[sendTransaction] executeTransactionBlock failed:",
          error
        );
        return null;
      })
      .finally(() => {
        setModalContent("");
      });
  }

  // Get the SUI balance for each account
  async function fetchBalances(accounts: AccountData[]) {
    if (accounts.length == 0) {
      return;
    }
    const newBalances: Map<string, number> = new Map();
    for (const account of accounts) {
      const suiBalance = await suiClient.getBalance({
        owner: account.userAddr,
        coinType: "0x2::sui::SUI",
      });
      newBalances.set(
        account.userAddr,
        +suiBalance.totalBalance / 1_000_000_000
      );
    }
    setBalances((prevBalances) => new Map([...prevBalances, ...newBalances]));
  }

  /* Local storage */

  function saveSetupData(data: SetupData) {
    localStorage.setItem(setupDataKey, JSON.stringify(data));
  }

  function loadSetupData(): SetupData | null {
    const dataRaw = localStorage.getItem(setupDataKey);
    if (!dataRaw) {
      return null;
    }
    const data: SetupData = JSON.parse(dataRaw);
    return data;
  }

  function clearSetupData(): void {
    localStorage.removeItem(setupDataKey);
  }

  function saveAccount(account: AccountData): void {
    const newAccounts = [account, ...accounts.current];
    localStorage.setItem(accountDataKey, JSON.stringify(newAccounts));
    accounts.current = newAccounts;
    fetchBalances([account]);
  }

  function loadAccounts(): AccountData[] {
    const dataRaw = localStorage.getItem(accountDataKey);
    if (!dataRaw) {
      return [];
    }
    const data: AccountData[] = JSON.parse(dataRaw);
    return data;
  }

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
      <div id="accounts" className="section">
        <h2 className="text-xl font-bold mb-2">Accounts:</h2>
        {accounts.current.map((acct) => {
          const balance = balances.get(acct.userAddr);
          const explorerLink = linkToExplorer(
            NETWORK,
            "address",
            acct.userAddr
          );
          return (
            <div
              className="account bg-white p-4 rounded mb-4 shadow"
              key={acct.userAddr}
            >
              <div className="mb-2">
                <label
                  className={`provider text-lg font-bold ${acct.provider}`}
                >
                  {acct.provider}
                </label>
              </div>
              <div className="mb-2">
                Address:{" "}
                <a
                  target="_blank"
                  rel="noopener"
                  href={explorerLink}
                  className="text-blue-500 hover:underline"
                >
                  {shortenAddress(acct.userAddr)}
                </a>
              </div>
              <div className="mb-2">User ID: {acct.sub}</div>
              <div className="mb-2">
                Balance:{" "}
                {typeof balance === "undefined"
                  ? "(loading)"
                  : `${balance} SUI`}
              </div>
              <button
                className={`btn-send py-2 px-4 rounded ${
                  !balance
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-700"
                }`}
                disabled={!balance}
                onClick={() => sendTransaction(acct)}
              >
                Send transaction
              </button>
              <hr className="my-4" />
            </div>
          );
        })}
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
