"use client";

import { useLocalStorage } from "usehooks-ts";
import { useRouter } from "next/navigation";
import { useLottie } from "src/utils/useLottie";
import { useEffect, useState } from "react";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import style from "../styles/login.module.css";
import { Account, OpenIdProvider } from "src/types";
import { useZkLoginSetup } from "src/store/zklogin";
import { moveCallSponsored } from "src/libs/coco/sponsoredZkLogin";
import { shortenAddress } from "src/utils";
import { cocoObjectType } from "src/config";
import googleAnimationData from "src/components/interface/animations/google.json";
import {
  EVENT_ZKLOGIN_ACCONTS,
  EVENT_OBJECT_ID,
  EVENT_ZKLOGIN_ADDRESS,
  EVENT_ZKLOGIN_COLOR,
} from "src/config";
import { getOwnedCocoObjectId } from "src/utils/getObject";

const styles = {
  compose: {
    background: "url('/login/background.png') center / cover no-repeat",
    width: "100vw",
    height: "100vh",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  contentTop: {
    paddingTop: "10vh",
  },
  contentBottom: {
    paddingBottom: "10vh",
  },
};

export default function Home() {
  const router = useRouter();
  const [modalContent, setModalContent] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [digest, setDigest] = useState<string>("");
  const [err, setErr] = useState<string>("");
  const [account, setAccount] = useLocalStorage<Account | null>(
    EVENT_ZKLOGIN_ACCONTS,
    null
  );
  const [objectid, setObjectid] = useLocalStorage<string | null>(
    EVENT_OBJECT_ID,
    null
  );
  const [zkAddress, setZkAddress] = useLocalStorage<string | null>(
    EVENT_ZKLOGIN_ADDRESS,
    null
  );
  const { container: googleAnimationContainer } = useLottie(
    googleAnimationData,
    true
  );
  const zkLoginSetup = useZkLoginSetup();

  const getObjectfromAddress = async (address: string) => {
    if (address) {
      const coco_id = await getOwnedCocoObjectId(address, cocoObjectType);
      if (coco_id !== "") {
        setObjectid(coco_id);
      }
    }
  };

  useEffect(() => {
    if (account) {
      zkLoginSetup.completeZkLogin(account);
    }
    if (objectid) {
      // router.push(`/events?objectid=${objectid}`);
      // router.push("/nft");
      router.push(`/events/${objectid}`);
    }
    if (zkAddress) {
      getObjectfromAddress(zkAddress);
    }
  }, []);

  useEffect(() => {
    if (zkLoginSetup.userAddr) {
      getObjectfromAddress(zkLoginSetup.userAddr);
      setZkAddress(zkLoginSetup.userAddr);
    }
  }, [zkLoginSetup.userAddr]);

  useEffect(() => {
    if (objectid) {
      // router.push(`/events?objectid=${objectid}`);
      // router.push("/nft");
      router.push(`/events/${objectid}`);
    }
  }, [objectid]);

  // https://docs.sui.io/build/zk_login#set-up-oauth-flow
  const beginZkLogin = async (provider: OpenIdProvider) => {
    setModalContent(`🔑 Logging in with ${provider}...`);

    await zkLoginSetup.beginZkLogin(provider);
    console.log(zkLoginSetup.account());
    setAccount(zkLoginSetup.account());
    console.log(zkLoginSetup.userAddr);
    setZkAddress(zkLoginSetup.userAddr);
    const loginUrl = zkLoginSetup.eventLoginUrl();
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

  return (
    // @ts-ignore
    <div
      className="flex flex-col items-center justify-center w-full"
      // @ts-ignore
      style={styles.compose}
    >
      <div style={styles.contentTop}>
        <p
          className={`${style.mySpecialFont} text-center text-white text-4xl mt-5`}
        >
          Sui POAP
        </p>
        <p
          className={`${style.mySpecialFont} mt-5 text-center text-white text-3xl font-bold leading-9`}
        >
          <span className="text-2xl">by</span> zkLogin & Sponsored Transaction
          <br />
        </p>
        <p
          className={`${style.mySpecialFont} flex items-center justify-center mt-3 text-center text-white text-3xl font-bold leading-9 gap-2`}
        >
          <span className="text-2xl">presented by</span> Umi Labs
          <img
            src="/logo.png"
            alt="Umi Labs Logo"
            style={{ height: "1.25em" }}
          />
        </p>
      </div>
      <div id="login-buttons" className="section mb-8">
        {openIdProviders.map((provider) => (
          <button
            className={`btn-login text-white font-bold py-1 px-10 rounded border-[2px] border-gray-300 ${provider}`}
            onClick={() => {
              beginZkLogin(provider);
            }}
            key={provider}
          >
            <div className="flex items-center">
              <div
                className="max-w-[50px]"
                ref={googleAnimationContainer}
              ></div>
              <div className="mr-5 text-lg">Login with {provider}</div>
            </div>
          </button>
        ))}
      </div>
      <div className="flex flex-col">
        <div className="flex mb-2">
          <p className="text-white text-lg flex-shrink-0">zkLogin Address:</p>
          {zkLoginSetup.userAddr && (
            <b className="ml-2">
              <a
                className="text-blue-400 underline"
                href={`https://suiscan.xyz/mainnet/account/${zkLoginSetup.userAddr}/tx-blocks`}
              >
                a{shortenAddress(zkLoginSetup.userAddr)}
              </a>
            </b>
          )}
        </div>
        <div className="flex mb-4">
          <p className="text-white text-lg flex-shrink-0">Current Status:</p>
          <b className="ml-2 text-white text-lg">{status()}</b>
        </div>
        <p className="mt-2">
          <a
            className="text-blue-400 underline"
            href={`https://suiscan.xyz/mainnet/tx/${digest}`}
          >
            {digest}
          </a>
        </p>
      </div>
      <div>
        <div className="text-red-700 text-lg flex-shrink-0">
          <b>{err}</b>
        </div>
      </div>
      <div
        className="flex flex-col justify-center items-center mb-5"
        style={styles.contentBottom}
      >
        <button
          onClick={async () => {
            setLoading(true);
            const account = zkLoginSetup.account();
            console.log("account", account);
            console.log(zkLoginSetup.userAddr);
            setZkAddress(zkLoginSetup.userAddr);
            const txb = new TransactionBlock();
            const result = await moveCallSponsored(txb, account, true);
            if (result.effects?.status.status === "success") {
              setDigest(result.digest);
              const matchingObject = result.objectChanges?.find(
                // @ts-ignore
                (obj) => obj?.objectType === cocoObjectType
              );
              // @ts-ignore
              if (!matchingObject || !matchingObject.objectType) {
                setErr("Double Mint rejected...");
                throw new Error("objectType not found");
              }
              // @ts-ignore
              setObjectid(matchingObject.objectId);
            } else {
              // setErr(`Transaction Failed: ${result.effects?.status.error}`);
              setErr("Transaction Failed : Mint period has expired.");
            }
            setLoading(false);
          }}
          className={`text-white w-32 py-3 px-5 rounded-xl text-xl ${
            style.myRobotoFont
          } ${
            !zkLoginSetup.zkProofs
              ? "bg-slate-800"
              : "bg-blue-600 hover:bg-slate-700"
          }`}
          disabled={!zkLoginSetup.zkProofs || loading}
        >
          {loading ? "Loading..." : "Mint"}
        </button>
      </div>
    </div>
  );
}