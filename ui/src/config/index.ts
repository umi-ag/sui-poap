// ui/src/config/index.ts
export const isProduction = () => {
  return process.env.NEXT_PUBLIC_ENVIRONMENT === "production";
};

export const PACKAGE_ID =
  "0x8a6c35229bc40afb6cb01c6f4512cf978c43b94d81b100a9bb5fda3e7f27f338";

export const EVENT_CONFIG_ID =
  "0xe4deba11203087c209e85ee560d4a74255d00d6f65a042ed8bdb3b81a0675060";

export const CLOCK_ID = "0x6";

export const cocoObjectType = `${PACKAGE_ID}::nft::CoCoNFT`;

export const ZKLOGIN_ACCONTS = `zklogin-demo.accounts`;

export const EVENT_CODE = "zklogin";

export const EVENT_KEY = "movejp10";
