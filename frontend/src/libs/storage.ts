import type { SetupData, AccountData } from "@/types";

/* Local storage keys */

export const setupDataKey = "zklogin-demo.setup";
export const accountDataKey = "zklogin-demo.accounts";

/* Local storage */

export const saveSetupData = (data: SetupData) => {
  localStorage.setItem(setupDataKey, JSON.stringify(data));
};

export const loadSetupData = (): SetupData | null => {
  const dataRaw = localStorage.getItem(setupDataKey);
  if (!dataRaw) {
    return null;
  }
  const data: SetupData = JSON.parse(dataRaw);
  return data;
};

export const clearSetupData = (): void => {
  localStorage.removeItem(setupDataKey);
};

export const saveAccount = (account: AccountData): void => {
  const newAccounts = [account, ...accounts.current];
  localStorage.setItem(accountDataKey, JSON.stringify(newAccounts));
  accounts.current = newAccounts;
  // fetchBalances([account]);
};

export const loadAccounts = (): AccountData[] => {
  const dataRaw = localStorage.getItem(accountDataKey);
  if (!dataRaw) {
    return [];
  }
  const data: AccountData[] = JSON.parse(dataRaw);
  return data;
};
