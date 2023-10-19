"use client";

import { ConnectButton } from "@suiet/wallet-kit";

export default function Home() {
  return (
    <div className="flex flex-col justify-center p-4">
      <header className="mb-10 flex justify-end items-start">
        <ConnectButton />
      </header>
    </div>
  );
}
