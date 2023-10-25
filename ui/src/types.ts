import Decimal from "decimal.js";

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


type Eyecatch = {
  url: string;
  height: number;
  width: number;
};

export type NewsItem = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  title: string;
  content?: string;
  eyecatch?: Eyecatch;
  category: null;
};

export type NewsItemList = NewsItem[];

export type VerifierInputs = {
  vk: string;
  public_inputs: string;
  proof_points: string;
};

export type Protocol = "Sharbet" | "Haedal" | "Volo" | "Scallop" | "NAVI";

export type Vault = {
  protocol: Protocol;
  syAssetType: string;
  ptAssetType: string;
  ytAssetType: string;
  principalAssetType: string;
  maturity: Date;
  maturityCode: "01Y" | "02Y";
  reserveSYAsset: bigint;
  longYieldAPY: Decimal;
  ytPrice: Decimal;
  fixedAPY: Decimal;
  ptPrice: Decimal;
  underlyingAPY: Decimal;
  underlyingAssetPrice: Decimal;
  impliedAPY: Decimal;
  status: "upcoming" | "live" | "matured";
};
