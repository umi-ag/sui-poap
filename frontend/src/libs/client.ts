import { suiClient } from "@/config/sui";
import type { AccountData } from "@/types";
import { ObjectId, getObjectFields } from "@mysten/sui.js";
// import { getOwnedObjects } from "@mysten/sui.js";
import { suiProvider } from "@/config/sui";

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

export const getUrl = async (objectId: string): Promise<ObjectId> => {
  console.log({ objectId });
  if (!objectId) {
    throw new Error("Object ID is not available");
  }
  const suiObject = await suiProvider.getObject({
    id: objectId,
    // id: "0x0e358d005fb484d1943d5f096c1780a53d20b78034a0bcf1202f689a77eb5d48",
    // id: "0xed6612983866f8b5ffe392935dd8e20e3b200d481f6387e9c99989bb0484ea5a",
    options: {
      showContent: true,
      showType: true,
    },
  });
  console.log({ suiObject });
  const { url }: any = getObjectFields(suiObject) || {};
  return url;
};

// export const hasNFT = async (owner: string) => {
//   const ownedObjects = await getOwnedObjects(owner);
//   console.log({ ownedObjects });
// };
