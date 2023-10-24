import { suiClient } from "@/config/sui";
import type { AccountData } from "@/types";

// Get the SUI balance for each account
// export const fetchBalances = async (accounts: AccountData[]) => {
//   if (accounts.length == 0) {
//     return;
//   }
//   const newBalances: Map<string, number> = new Map();
//   for (const account of accounts) {
//     const suiBalance = await suiClient.getBalance({
//       owner: account.userAddr,
//       coinType: "0x2::sui::SUI",
//     });
//     newBalances.set(account.userAddr, +suiBalance.totalBalance / 1_000_000_000);
//   }
//   setBalances((prevBalances) => new Map([...prevBalances, ...newBalances]));
// };

export const fetchBalances = async (
  accounts: AccountData[]
): Promise<Map<string, number>> => {
  const newBalances: Map<string, number> = new Map();
  if (accounts.length === 0) {
    return newBalances;
  }
  for (const account of accounts) {
    const suiBalance = await suiClient.getBalance({
      owner: account.userAddr,
      coinType: "0x2::sui::SUI",
    });
    newBalances.set(account.userAddr, +suiBalance.totalBalance / 1_000_000_000);
  }
  return newBalances;
};
