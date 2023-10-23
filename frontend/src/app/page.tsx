"use client";

import { ConnectButton, useWallet } from "@suiet/wallet-kit";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { sponsorTransactionE2E, moveCallMintNft } from "@/libs/movecall";
import { TransactionBlock } from "@mysten/sui.js";
import { SENDER_ADDRESS, GAS_BUDGET, sponsor, suiProvider } from "@/config/sui";
// import { ConnectButton, useWalletKit } from "@mysten/wallet-kit";

export default function Home() {
  const router = useRouter();
  const wallet = useWallet();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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
        name: "wasabi",
        description: "wasabi's icon",
        url: "https://pbs.twimg.com/profile_images/1538981748478214144/EUjTgb0v_400x400.jpg",
        date: "2023/10/30",
        item_name: "jiro",
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
      if (executeResponse.effects?.status.status === "success") {
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
      await executeTx();
    } catch (error) {
      console.error("Error executing sponsorTransactionE2E:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-between items-center p-4">
      <header className="flex justify-end items-start w-full">
        <ConnectButton />
      </header>
      <div className="flex flex-col justify-center items-center">
        <button
          onClick={async (event: any) => {
            event.preventDefault();
            await exctuteMintNFT();
          }}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          disabled={loading}
        >
          {loading ? "Loading..." : "Execute Transaction"}
        </button>
      </div>
    </div>
  );
}
