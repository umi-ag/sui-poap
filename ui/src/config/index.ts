// ui/src/config/index.ts
export const isProduction = () => {
  return process.env.NEXT_PUBLIC_ENVIRONMENT === "production";
};

export const PACKAGE_ID =
  "0x878ece06b60957e8c09f09f5a65a2c5b33232b53a652e2a88e3bcaa85dc0d481";

export const EVENT_CONFIG_ID =
  "0x562f84651d1096ecccc7d535dddeaad96617fc9e0fd694df4d90ee43a1269992";

export const CLOCK_ID = "0x6";

export const cocoObjectType = `${PACKAGE_ID}::nft::CoCoNFT`;

export const ZKLOGIN_ACCONTS = `zklogin-demo.accounts`;

export const EVENT_CODE = "zklogin";
