// ui/src/config/index.ts
export const isProduction = () => {
  return process.env.NEXT_PUBLIC_ENVIRONMENT === "production";
};

export const PACKAGE_ID =
  "0xa83fad6febe333a484de95ea62be6344280548f2cb3cdd54782300914b50efe1";

export const EVENT_CONFIG_ID =
  "0x8dc7bd83293d27e578194de7cb5b39778e9d777722475817c2cf6e2c5d90d808";

export const CLOCK_ID = "0x6";

export const cocoObjectType = `${PACKAGE_ID}::nft::CoCoNFT`;

export const ZKLOGIN_ACCONTS = `zklogin-demo.accounts`;

export const EVENT_CODE = "zklogin";

export const EVENT_KEY = "movejp10";
