"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import { WalletProvider } from "@suiet/wallet-kit";
import "@suiet/wallet-kit/style.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
