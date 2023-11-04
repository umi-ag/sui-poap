// ui/src/app/page.tsx
"use client";

import { useLocalStorage } from "usehooks-ts";
import { useRouter } from "next/navigation";
import { useLottie } from "src/utils/useLottie";
import { useEffect, useState } from "react";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import style from "src/app//styles/login.module.css";
import { styles } from "src/app/styles";
import { Account, OpenIdProvider } from "src/types";
import { useZkLoginSetup } from "src/store/zklogin";
import { moveCallSponsored } from "src/libs/coco/sponsoredZkLogin";
import { shortenAddress } from "src/utils";
import { cocoObjectType } from "src/config";
import googleAnimationData from "src/components/interface/animations/google.json";
import { ZKLOGIN_ACCONTS } from "src/config";
import { getOwnedCocoObjectId } from "src/utils/getObject";

export default function Home() {
  const router = useRouter();
  const [modalContent, setModalContent] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [digest, setDigest] = useState<string>("");
  const [err, setErr] = useState<string>("");
  const [account, setAccount] = useLocalStorage<Account | null>(
    ZKLOGIN_ACCONTS,
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
        // router.push("/nft");
        router.push(`/${coco_id}`);
      }
    }
  };

  useEffect(() => {
    if (account) {
      zkLoginSetup.completeZkLogin(account);
    }
    if (zkLoginSetup.userAddr) {
      getObjectfromAddress(zkLoginSetup.userAddr);
    }
  }, []);

  // useEffect(() => {
  //   if (zkLoginSetup.userAddr) {
  //     getObjectfromAddress(zkLoginSetup.userAddr);
  //   }
  // }, [zkLoginSetup.userAddr]);

  // https://docs.sui.io/build/zk_login#set-up-oauth-flow
  const beginZkLogin = async (provider: OpenIdProvider) => {
    setModalContent(`🔑 Logging in with ${provider}...`);

    await zkLoginSetup.beginZkLogin(provider);
    console.log(zkLoginSetup.account());
    setAccount(zkLoginSetup.account());
    console.log(zkLoginSetup.userAddr);
    const loginUrl = zkLoginSetup.loginUrl();
    window.location.replace(loginUrl);
  };

  const openIdProviders: OpenIdProvider[] = [
    "Google",
    // "Twitch",
    // "Facebook",
  ];

  const status = () => {
    if (!zkLoginSetup.userAddr) {
      return "Not signed in";
    }

    if (!zkLoginSetup.zkProofs && zkLoginSetup.isProofsLoading) {
      return "Loading zk proofs...";
    }

    return "Ready!";
  };

  return (
    <div
      className="flex flex-col items-center justify-center w-full"
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
          <span className="text-2xl">by</span> zkLogin & Sponsored Transaction,
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
          {zkLoginSetup.zkProofs && (
            <b className="ml-2">
              <a
                className="text-blue-400 underline"
                href={`https://suiscan.xyz/mainnet/account/${zkLoginSetup.userAddr}/tx-blocks`}
              >
                {shortenAddress(zkLoginSetup.userAddr)}
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
            const txb = new TransactionBlock();
            const result = await moveCallSponsored(txb, account);
            if (result.effects?.status.status === "success") {
              setDigest(result.digest);
              const matchingObject: any = result.objectChanges?.find(
                (obj: any) => obj?.objectType === cocoObjectType
              );
              if (!matchingObject || !matchingObject.objectType) {
                setErr("Double Mint rejected...");
                throw new Error("objectType not found");
              }
            } else {
              // setErr(`Transaction Failed: ${result.effects?.status.error}`);
              setErr("Transaction Failed...");
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
