"use client";

import { ConnectButton, useWallet } from "@suiet/wallet-kit";
import { useState, useEffect } from "react";
import { sponsorTransactionE2E } from "@/libs/movecall";
import { TransactionBlock } from "@mysten/sui.js";
import { suiProvider } from "@/config/sui";

export default function Home() {
  // console.log(process.env.NEXT_PUBLIC_GAS_ACCESS_KEY);
  const wallet = useWallet();
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState(null);
  const [sponsor, setSponsor] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:3000/api");
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();
      console.log({ data });
      setProvider(data.provider);
      setSponsor(data.sponsor);
    };
    fetchData();
  }, []);

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
          onClick={handleButtonClick}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          disabled={loading}
        >
          {loading ? "Loading..." : "Execute Transaction"}
        </button>
      </div>
    </div>
  );
}
