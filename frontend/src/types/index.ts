// Setup for issuing json rpc calls to the gas station for sponsorship.
export interface SponsoredTransaction {
  txBytes: string;
  txDigest: string;
  signature: string;
  expireAtTime: number;
  expireAfterEpoch: number;
}
export type SponsoredTransactionStatus = "IN_FLIGHT" | "COMPLETE" | "INVALID";

export interface SponsorRpc {
  gas_sponsorTransactionBlock(
    txBytes: string,
    sender: string,
    gasBudget: number
  ): SponsoredTransaction;
  gas_getSponsoredTransactionBlockStatus(
    txDigest: string
  ): SponsoredTransactionStatus;
}

export type OpenIdProvider = "Google" | "Twitch" | "Facebook";

export type SetupData = {
  provider: OpenIdProvider;
  maxEpoch: number;
  randomness: string;
  ephemeralPublicKey: string;
  ephemeralPrivateKey: string;
};

export type AccountData = {
  provider: OpenIdProvider;
  userAddr: string;
  zkProofs: any; // TODO: add type
  ephemeralPublicKey: string;
  ephemeralPrivateKey: string;
  userSalt: string;
  sub: string;
  aud: string;
  maxEpoch: number;
};
