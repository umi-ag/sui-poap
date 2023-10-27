"use client";

import { useWallet } from "@suiet/wallet-kit";
import { useLocalStorage } from "usehooks-ts";
import { useRouter } from "next/navigation";
import { MouseEventHandler, ReactNode, useEffect, useState } from "react";
import { TransactionBlock } from "@mysten/sui.js/transactions";
// import { ConnectButton, useWalletKit } from "@mysten/wallet-kit";
import style from "./styles/login.module.css";
import { moveCallMintNft, sponsorTransactionE2E } from "src/libs/coco";
import { GAS_BUDGET, sponsor, suiClient } from "src/config/sui";
import { Account, OpenIdProvider } from "src/types";
import { CoCoNFT } from "src/libs/moveCall/coco/my-nft/structs";
import { useZkLoginSetup } from "src/store/zklogin";
import { moveCallSponsored } from "src/libs/coco/sponsoredZkLogin";
import { NETWORK } from "src/config/sui";
import { PACKAGE_ID, cocoObjectType } from "src/config";
import { CoCoNFTView, CoCoNFTProps } from "src/app/nft/components/CoCoNFTView";

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

export default function Home() {
  const router = useRouter();
  const wallet = useWallet();
  const [modalContent, setModalContent] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [digest, setDigest] = useState<string>("");
  const [account, setAccount] = useLocalStorage<Account | null>(
    ZKLOGIN_ACCONTS,
    null
  );
  const zkLoginSetup = useZkLoginSetup();
  const [colors, setColors] = useState<CoCoNFTProps>({
    l1: 0xffd1dc,
    l2: 0xaec6cf,
    l3: 0xb39eb5,
    r1: 0xbfd3c1,
    r2: 0xfff5b2,
    r3: 0xffb347,
  });

  useEffect(() => {
    if (account) {
      zkLoginSetup.completeZkLogin(account);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("colors", JSON.stringify(colors));
  }, [colors]);

  const styles = {
    compose: {
      // background: "url('/login/background.png') center / cover no-repeat",
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

  const splitObjectId = (objectId: string) => {
    const str = objectId.slice(2);
    const length = str.length;
    const partLength = Math.ceil(length / 6);
    const parts = [];

    for (let i = 0; i < 6; i++) {
      parts.push(str.slice(i * partLength, (i + 1) * partLength));
    }

    return parts;
  };

  const executeTx = async () => {
    const sponsoredResponse = await sponsorTransactionE2E();
    const { signature } = await wallet.signTransactionBlock({
      // @ts-ignore
      transactionBlock: TransactionBlock.from(sponsoredResponse.txBytes),
    });
    console.log({ signature });
    const executeResponse = await suiClient.executeTransactionBlock({
      transactionBlock: sponsoredResponse.txBytes,
      signature: [signature, sponsoredResponse.signature],
      options: { showEffects: true },
      requestType: "WaitForLocalExecution",
    });
    console.log({ executeResponse });
    console.log("Execution Status:", executeResponse.effects?.status.status);
    const url = `https://suiexplorer.com/txblock/${executeResponse.digest}?network=testnet`;
    console.log(url);
  };

  const exctuteMintNFT = async () => {
    const txb = new TransactionBlock();
    try {
      moveCallMintNft(txb, {
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
      const gaslessPayloadBytes = await txb.build({
        provider: suiClient,
        onlyTransactionKind: true,
      });
      console.log({ gaslessPayloadBytes });

      const gaslessPayloadBase64 = btoa(
        gaslessPayloadBytes.reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );

      console.log("#34", { gaslessPayloadBase64 });

      if (!wallet.account || !wallet.account.address) {
        console.error("Wallet address is undefined");
        return;
      }

      console.log("#35", wallet.account.address);

      const sponsoredResponse = await sponsor.gas_sponsorTransactionBlock(
        gaslessPayloadBase64,
        wallet.account.address,
        GAS_BUDGET
      );

      console.log("#36", { sponsoredResponse });

      const sponsoredStatus =
        await sponsor.gas_getSponsoredTransactionBlockStatus(
          sponsoredResponse.txDigest
        );

      console.log("Sponsorship Status:", sponsoredStatus);
      alert("#38");
      const { signature } = await wallet.signTransactionBlock({
        // @ts-ignore
        transactionBlock: TransactionBlock.from(sponsoredResponse.txBytes),
      });

      console.log({ signature });
      alert("#41");
      const executeResponse = await suiClient.executeTransactionBlock({
        transactionBlock: sponsoredResponse.txBytes,
        signature: [signature, sponsoredResponse.signature],
        options: { showEffects: true, showObjectChanges: true },
        requestType: "WaitForLocalExecution",
      });
      console.log({ executeResponse });
      alert("#42");

      if (executeResponse.effects?.status.status === "success") {
        const matchingObject = executeResponse.objectChanges?.find(
          // @ts-ignore
          (obj) => obj?.objectType === CoCoNFT.$typeName
        );

        if (matchingObject) {
          alert("#43");
          // @ts-ignore
          setObjectId(matchingObject.objectId);
          // @ts-ignore
          console.log(matchingObject.objectId);

          // @ts-ignore
          const parts = splitObjectId(matchingObject.objectId);
          console.log({ parts });
          const result = parseInt("0xcf2ff2a39", 16);
          console.log(result);
          setColors({
            l1: parseInt(parts[0], 16),
            l2: parseInt(parts[1], 16),
            l3: parseInt(parts[2], 16),
            r1: parseInt(parts[3], 16),
            r2: parseInt(parts[4], 16),
            r3: parseInt(parts[5], 16),
          });
          console.log({ colors });
          console.log(
            "Execution Status:",
            executeResponse.effects?.status.status
          );
          const url = `https://suiexplorer.com/txblock/${executeResponse.digest}?network=testnet`;
          console.log(url);
          // localStorage.setItem("colors", JSON.stringify(colors));
          router.push("/coin");
        }
      }
    } catch (err) {
      console.log("err:", err);
    }
  };

  const updateColors = (result: any) => {
    const matchingObject = result.objectChanges?.find(
      // @ts-ignore
      (obj) => obj?.objectType === CoCoNFT.$typeName
    );
    // @ts-ignore
    const parts = splitObjectId(matchingObject.objectId);
    console.log({ parts });
    setColors({
      l1: parseInt(parts[0], 16),
      l2: parseInt(parts[1], 16),
      l3: parseInt(parts[2], 16),
      r1: parseInt(parts[3], 16),
      r2: parseInt(parts[4], 16),
      r3: parseInt(parts[5], 16),
    });
  };

  const handleButtonClick = async () => {
    setLoading(true);
    try {
      await exctuteMintNFT();
    } catch (error) {
      console.error("Error executing sponsorTransactionE2E:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    // <header className="flex justify-end items-start w-full hidden">
    //   <ConnectButton />
    // </header>
    // @ts-ignore
    <div style={styles.compose}>
      <div style={styles.contentTop}>
        <p
          className={`${style.mySpecialFont} text-center text-slate-600 text-4xl mt-5`}
        >
          POAP by zkLogin
        </p>
        <p
          className={`${style.mySpecialFont} mt-5 text-center text-slate-600 text-3xl font-bold leading-9`}
        >
          Sponsored Transaction,
          <br />
          Dynamic / Composable NFT
          <br />
        </p>
        <p
          className={`${style.mySpecialFont} mt-3 text-center text-slate-600 text-3xl font-bold leading-9`}
        >
          <span className="text-2xl">presented by</span> Umi Labs
        </p>
      </div>
      <div id="network-indicator" className="mb-4">
        <label className="text-lg font-bold">{NETWORK}</label>
      </div>
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
      <p className="mt-2">
        <a
          className="text-blue-400 underline"
          href={`https://suiscan.xyz/mainnet/tx/${digest}`}
        >
          {digest}
        </a>
      </p>
      <div
        className="flex flex-col justify-center items-center"
        style={styles.contentBottom}
      >
        <button
          onClick={async () => {
            const account = zkLoginSetup.account();
            console.log("account", account);
            const txb = new TransactionBlock();
            const result = await moveCallSponsored(txb, account);
            setDigest(result.digest);
            updateColors(result);
            router.push("/nft");
          }}
          className={`bg-slate-600 hover:bg-slate-700 text-white w-32 py-3 px-5 rounded-xl text-xl ${style.myRobotoFont}`}
          // disabled={loading}
          disabled={!zkLoginSetup.zkProofs}
        >
          {loading ? "Loading..." : "Mint"}
        </button>
      </div>
    </div>
  );
}
