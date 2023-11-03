// ui/src/config/index.ts
export const isProduction = () => {
  return process.env.NEXT_PUBLIC_ENVIRONMENT === "production";
};

export const PACKAGE_ID =
  "0x91933dc41b3c13818d4674b9dfd8936f65520c1b17ec0ec6eb5c28bcaca0438b";

export const VISITOR_LIST_ID =
  "0x9057a07d88e07f7b8b748a04a1d2810dbc2ee092dfd7597aa6e5396b18144568";

export const CLOCK_ID = "0x6";

export const cocoObjectType = `${PACKAGE_ID}::nft::CoCoNFT`;

export const ZKLOGIN_ACCONTS = `zklogin-${VISITOR_LIST_ID}.accounts`;
export const OBJECT_ID = `zklogin-${VISITOR_LIST_ID}.objectid`;
export const ZKLOGIN_ADDRESS = `zklogin-${VISITOR_LIST_ID}.address`;
export const ZKLOGIN_COLOR = `zklogin-${VISITOR_LIST_ID}.color`;

export const EVENT_CODE = "zklogin";
