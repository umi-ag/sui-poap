"use client";

import { ConnectButton, useWallet } from "@suiet/wallet-kit";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { sponsorTransactionE2E, moveCallMintNft } from "@/libs/movecall";
import { TransactionBlock } from "@mysten/sui.js";
import { SENDER_ADDRESS, GAS_BUDGET, sponsor, suiProvider } from "@/config/sui";
import { PACKAGE_ID } from "@/config/constants";
// import { ConnectButton, useWalletKit } from "@mysten/wallet-kit";
import style from "./styles/login.module.css";

export default function Home() {
  const router = useRouter();
  const wallet = useWallet();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [objectId, setObjectId] = useState("");
  const [colors, setColors] = useState({
    l1: 0xffd1dc,
    l2: 0xaec6cf,
    l3: 0xb39eb5,
    r1: 0xbfd3c1,
    r2: 0xfff5b2,
    r3: 0xffb347,
  });

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

  useEffect(() => {
    localStorage.setItem("colors", JSON.stringify(colors));
  }, [colors]);

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
      transactionBlock: TransactionBlock.from(sponsoredResponse.txBytes),
    });
    console.log({ signature });
    const executeResponse = await suiProvider.executeTransactionBlock({
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
    setMessage("");
    try {
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

      console.log({ gaslessPayloadBase64 });

      if (!wallet.account || !wallet.account.address) {
        console.error("Wallet address is undefined");
        return;
      }

      const sponsoredResponse = await sponsor.gas_sponsorTransactionBlock(
        gaslessPayloadBase64,
        wallet.account.address,
        GAS_BUDGET
      );

      console.log({ sponsoredResponse });

      const sponsoredStatus =
        await sponsor.gas_getSponsoredTransactionBlockStatus(
          sponsoredResponse.txDigest
        );
      console.log("Sponsorship Status:", sponsoredStatus);
      const { signature } = await wallet.signTransactionBlock({
        transactionBlock: TransactionBlock.from(sponsoredResponse.txBytes),
      });
      console.log({ signature });
      const targetType = `${PACKAGE_ID}::my_nft::CoCoNFT`;
      const executeResponse = await suiProvider.executeTransactionBlock({
        transactionBlock: sponsoredResponse.txBytes,
        signature: [signature, sponsoredResponse.signature],
        options: { showEffects: true, showObjectChanges: true },
        requestType: "WaitForLocalExecution",
      });
      console.log({ executeResponse });
      if (executeResponse.effects?.status.status === "success") {
        const matchingObject = executeResponse.objectChanges?.find(
          (obj) => obj?.objectType === targetType
        );
        setObjectId(matchingObject.objectId);
        console.log(matchingObject.objectId);
        localStorage.setItem("objectId", matchingObject.objectId);
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
        setMessage(`Mint Success! : ${url}`);
        // localStorage.setItem("colors", JSON.stringify(colors));
        router.push("/coin");
      }
    } catch (err) {
      console.log("err:", err);
      setMessage(`Mint failed ${err}`);
    }
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
    <div style={styles.compose}>
      <div style={styles.contentTop}>
        <p
          className={`${style.mySpecialFont} text-center text-white text-4xl mt-5`}
        >
          POAP by zkLogin
        </p>
        <p
          className={`${style.mySpecialFont} mt-5 text-center text-white text-3xl font-bold leading-9`}
        >
          Sponsored Transaction,
          <br />
          Dynamic / Composable NFT
          <br />
        </p>
        <p
          className={`${style.mySpecialFont} mt-3 text-center text-white text-3xl font-bold leading-9`}
        >
          <span className="text-2xl">presented by</span> Umi Labs
        </p>
      </div>
      <div
        className="flex flex-col justify-center items-center"
        style={styles.contentBottom}
      >
        <button
          onClick={async (event: any) => {
            event.preventDefault();
            await handleButtonClick();
          }}
          className={`bg-gray-500 hover:bg-gray-700 text-white py-3 px-5 rounded-2xl text-xl ${style.myRobotoFont}`}
          disabled={loading}
        >
          {loading ? "Loading..." : "Mint"}
        </button>
      </div>
    </div>
  );
}
