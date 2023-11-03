import { suiClient } from "src/config/sui";
import { AccountData } from "src/types";
import { ObjectId } from "./moveCall/_framework/util";

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
  const suiObject = await suiClient.getObject({
    id: objectId,
    options: {
      showContent: true,
      showType: true,
    },
  });
  console.log({ suiObject });
  // TODO: fix this
  return "";
};
