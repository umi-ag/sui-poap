// ui/src/config/index.ts
export const isProduction = () => {
  return process.env.NEXT_PUBLIC_ENVIRONMENT === "production";
};

// mainnet
export const EVENT_PACKAGE_ID =
  "0x6d2c1faa1b504cccad8c25d64aa7f288d6e3909a6ee79b6a78d69c4884ee913d";

// mainnet
export const EVENT_VISITOR_LIST_ID =
  "0xd8ef456b25f027a6c38025f2045cfcfa3dbe2c95f239d8255e4e998d6e4855b4";

// testnet
export const DEMO_PACKAGE_ID =
  "0x40c7d80359d745989efeea40eaf85416b58a641c5faaac1d73a27cbb0be7283f";

// testnet
export const DEMO_VISITOR_LIST_ID =
  "0x2f8102fc25b5ea59580c7996414ba6016ece3a0a8716058ae4c3d20e27f7be90";

export const CLOCK_ID = "0x6";

export const cocoObjectType = `${EVENT_PACKAGE_ID}::nft::CoCoNFT`;
export const demoObjectType = `${DEMO_PACKAGE_ID}::nft::CoCoNFT`;

export const EVENT_ZKLOGIN_ACCONTS = `zklogin-${EVENT_VISITOR_LIST_ID}.accounts`;
export const EVENT_OBJECT_ID = `zklogin-${EVENT_VISITOR_LIST_ID}.objectid`;
export const EVENT_ZKLOGIN_ADDRESS = `zklogin-${EVENT_VISITOR_LIST_ID}.address`;
export const EVENT_ZKLOGIN_COLOR = `zklogin-${EVENT_VISITOR_LIST_ID}.color`;

export const DEMO_ZKLOGIN_ACCONTS = `zklogin-${DEMO_VISITOR_LIST_ID}.accounts`;
export const DEMO_OBJECT_ID = `zklogin-${DEMO_VISITOR_LIST_ID}.objectid`;
export const DEMO_ZKLOGIN_ADDRESS = `zklogin-${DEMO_VISITOR_LIST_ID}.address`;
export const DEMO_ZKLOGIN_COLOR = `zklogin-${DEMO_VISITOR_LIST_ID}.color`;

export const EVENT_CODE = "zklogin";
