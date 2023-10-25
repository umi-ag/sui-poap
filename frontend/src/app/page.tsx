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
import type { OpenIdProvider, SetupData, AccountData } from "@/types";
import { moveCallMintNft } from "@/libs/movecall";
import { SENDER_ADDRESS, GAS_BUDGET, sponsor, suiProvider } from "@/config/sui";

import config from "@/config/config.json";
const NETWORK = "mainnet";
const MAX_EPOCH = 1; // keep ephemeral keys active for this many Sui epochs from now (1 epoch ~= 24h)

const suiClient = new SuiClient({
  url: getFullnodeUrl(NETWORK),
});

/* Local storage keys */

const setupDataKey = "zklogin-demo.setup";
const accountDataKey = "zklogin-demo.accounts";

export const Home = () => {
  const accounts = useRef<AccountData[]>(loadAccounts()); // useRef() instead of useState() because of setInterval()
  const [balances, setBalances] = useState<Map<string, number>>(new Map()); // Map<Sui address, SUI balance>
  const [modalContent, setModalContent] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    completeZkLogin();

    fetchBalances(accounts.current);
    const interval = setInterval(() => fetchBalances(accounts.current), 60_000);
    return () => clearInterval(interval);
  }, []);

  /* zkLogin logic */

  // https://docs.sui.io/build/zk_login#set-up-oauth-flow
  async function beginZkLogin(provider: OpenIdProvider) {
    setModalContent(`🔑 Logging in with ${provider}...`);

    // Create a nonce
    const { epoch } = await suiClient.getLatestSuiSystemState();
    const maxEpoch = Number(epoch) + MAX_EPOCH; // the ephemeral key will be valid for MAX_EPOCH from now
    console.log({ maxEpoch });
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
        // router.push("/account");
      } catch (error) {
        console.error("Error:", error);
        return;
      }
    }

    sendRequest();
  }

  async function transfer_zkl(account: AccountData) {
    const destAddr = '0x1af1728adfd0286249259b3e5bcc0ce573a10ac7e5dd114fae7133f56f367e02';
    // const account = accounts.current[0];

    const txb = new TransactionBlock();
    txb.setSender(account.userAddr);
    const c = txb.splitCoins(txb.gas, [txb.pure(5e6)]);
    txb.transferObjects([c], txb.pure(destAddr));

    const ephemeralKeyPair = Ed25519Keypair.fromSecretKey(
      Buffer.from(account.ephemeralPrivateKey, "base64")
    );

    console.log({ ephemeralKeyPair });

    const { bytes, signature: userSignature } = await txb.sign({
      client: suiProvider,
      signer: ephemeralKeyPair,
    });

    console.log({ bytes });
    // console.log(sponsoredResponse.txBytes);
    // console.log(bytes === sponsoredResponse.txBytes);
    console.log({ userSignature });

    // Generate an address seed by combining userSalt, sub (subject ID), and aud (audience).
    const addressSeed = genAddressSeed(
      BigInt(account.userSalt),
      "sub",
      account.sub,
      account.aud
    ).toString();

    console.log(account.zkProofs);
    console.log(account.maxEpoch);

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

    console.log({ zkLoginSignature });
    // console.log(sponsoredResponse.signature);

    // Execute the transaction
    const r = await suiProvider
      .executeTransactionBlock({
        transactionBlock: bytes,
        signature: [zkLoginSignature],
        requestType: "WaitForLocalExecution",
        options: {
          showEffects: true,
        },
      });

    console.log('r', r);
  }

  async function transfer_zkl_stx(account: AccountData) {
    const destAddr = '0x1af1728adfd0286249259b3e5bcc0ce573a10ac7e5dd114fae7133f56f367e02';
    // const account = accounts.current[0];

    const coins = await suiProvider.getAllCoins({ owner: account.userAddr });
    const sui = coins.data.find(d => d.coinType === '0x2::sui::SUI');

    const txb = new TransactionBlock();
    txb.setSender(account.userAddr);
    const c = txb.splitCoins(txb.pure(sui?.coinObjectId), [txb.pure(5e6)]);
    txb.transferObjects([c], txb.pure(destAddr));

    const payloadBytes = await txb.build({
      provider: suiProvider,
      onlyTransactionKind: true,
    });

    const payloadBase64 = btoa(
      payloadBytes.reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    );
    const sponsoredResponse = await sponsor.gas_sponsorTransactionBlock(
      payloadBase64,
      account.userAddr,
      GAS_BUDGET
    );

    const sponsoredStatus =
      await sponsor.gas_getSponsoredTransactionBlockStatus(
        sponsoredResponse.txDigest
      );
    console.log("Sponsorship Status:", sponsoredStatus);

    const ephemeralKeyPair = Ed25519Keypair.fromSecretKey(
      Buffer.from(account.ephemeralPrivateKey, "base64")
    );
    console.log({ ephemeralKeyPair });

    const { bytes, signature: userSignature } = await txb.sign({
      client: suiProvider,
      signer: ephemeralKeyPair,
    });

    console.log({ bytes });
    // console.log(sponsoredResponse.txBytes);
    // console.log(bytes === sponsoredResponse.txBytes);
    console.log({ userSignature });

    // Generate an address seed by combining userSalt, sub (subject ID), and aud (audience).
    const addressSeed = genAddressSeed(
      BigInt(account.userSalt),
      "sub",
      account.sub,
      account.aud
    ).toString();

    console.log(account.zkProofs);
    console.log(account.maxEpoch);

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

    console.log({ zkLoginSignature });
    // console.log(sponsoredResponse.signature);

    // Execute the transaction
    const r = await suiProvider
      .executeTransactionBlock({
        transactionBlock: bytes,
        signature: [zkLoginSignature, sponsoredResponse.signature],
        requestType: "WaitForLocalExecution",
        options: {
          showEffects: true,
        },
      });

    console.log('r', r);
  }


  // Assemble a zkLogin signature and submit a transaction
  // https://docs.sui.io/build/zk_login#assemble-the-zklogin-signature-and-submit-the-transaction
  async function sendTransaction(account: AccountData) {
    console.log(account);
    setModalContent("🚀 Sending transaction...");

    // Sign the transaction bytes with the ephemeral private key.
    // const txb = new TransactionBlock();
    // txb.setSender(account.userAddr);
    const gaslessTxb = await moveCallMintNft({
      origin_name: "wasabi",
      origin_description: "wasabi's icon",
      origin_url:
        "https://pbs.twimg.com/profile_images/1538981748478214144/EUjTgb0v_400x400.jpg",
      item_name: "jiro",
      item_description: "a",
      item_url:
        "https://toy.bandai.co.jp/assets/tamagotchi/images/chopper/img_chara01.png",
      date: "2023/10/30",
    });
    const gaslessPayloadBytes = await gaslessTxb.build({
      provider: suiProvider,
      onlyTransactionKind: true,
    });
    console.log({ gaslessPayloadBytes });

    const gaslessPayloadBase64 = btoa(
      gaslessPayloadBytes.reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    );

    console.log(account.userAddr);

    gaslessTxb.setSender(account.userAddr);
    // gaslessTxb.setGasOwner(sponsor.toSuiAddress());
    // gaslessTxb.setGasOwner(
    //   "0xc30e760a16c0e1cd27b4890b0b1a7b2bcb55e84194a081a4b880c9a0f8fd9a4f"
    // );

    console.log({ gaslessPayloadBase64 });

    const sponsoredResponse = await sponsor.gas_sponsorTransactionBlock(
      gaslessPayloadBase64,
      account.userAddr,
      GAS_BUDGET
    );

    console.log({ sponsoredResponse });

    const sponsoredStatus =
      await sponsor.gas_getSponsoredTransactionBlockStatus(
        sponsoredResponse.txDigest
      );
    console.log("Sponsorship Status:", sponsoredStatus);

    const ephemeralKeyPair = Ed25519Keypair.fromSecretKey(
      Buffer.from(account.ephemeralPrivateKey, "base64")
    );

    console.log({ ephemeralKeyPair });

    const { bytes, signature: userSignature } = await gaslessTxb.sign({
      client: suiProvider,
      signer: ephemeralKeyPair,
    });

    // const { bytes, signature: userSignature } = await gaslessTxb.sign({
    //   // suiProvider,
    //   signer: ephemeralKeyPair,
    // });

    console.log({ bytes });
    console.log(sponsoredResponse.txBytes);
    console.log(bytes === sponsoredResponse.txBytes);
    console.log({ userSignature });

    // Generate an address seed by combining userSalt, sub (subject ID), and aud (audience).
    const addressSeed = genAddressSeed(
      BigInt(account.userSalt),
      "sub",
      account.sub,
      account.aud
    ).toString();

    console.log(account.zkProofs);

    console.log(account.maxEpoch);

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

    console.log({ zkLoginSignature });
    console.log(sponsoredResponse.signature);

    // Execute the transaction
    await suiProvider
      .executeTransactionBlock({
        transactionBlock: bytes,
        signature: [zkLoginSignature, sponsoredResponse.signature],
        // signature: [userSignature, sponsoredResponse.signature],
        requestType: "WaitForLocalExecution",
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
                className="btn-send py-2 px-4 mr-4 rounded bg-blue-500 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                // disabled={!balance}
                onClick={() => sendTransaction(acct)}
              >
                Mint
              </button>
              <button
                className="btn-send py-2 px-4 mr-4 rounded bg-blue-500 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                // disabled={!balance}
                onClick={() => transfer_zkl(acct)}
              >
                transfer_zkl
              </button>
              <button
                className="btn-send py-2 px-4 mr-4 rounded bg-blue-500 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                // disabled={!balance}
                onClick={() => transfer_zkl_stx(acct)}
              >
                transfer_zkl_stx
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
