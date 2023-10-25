"use client"

import './globals.css'
import '@suiet/wallet-kit/style.css';
import {
  WalletProvider,
  AllDefaultWallets
} from '@suiet/wallet-kit';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <WalletProvider defaultWallets={AllDefaultWallets}>
        <body className="bg-base-100">
          {children}
          <Toaster />
        </body>
      </WalletProvider>
    </html>
  )
}
