// ui/src/config/index.ts
export const isProduction = () => {
  return process.env.NEXT_PUBLIC_ENVIRONMENT === "production";
};

export const PACKAGE_ID =
  "0xdbda1f10ee21cea9f017a6c103b144166138966e5c09a3d9f43e4d9f03b16c2e";

export const EVENT_CONFIG_ID =
  "0x1a98d7905b3ab0d9ef374f548dd7ab947b304dd5f9083ff9eb8adf0d698f0688";

export const CLOCK_ID = "0x6";

export const cocoObjectType = `${PACKAGE_ID}::nft::CoCoNFT`;

export const ZKLOGIN_ACCONTS = `zklogin-demo.accounts`;

export const EVENT_CODE = "zklogin";

export const EVENT_KEY = "movejp10";
