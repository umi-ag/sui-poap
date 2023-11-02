// ui/src/config/index.ts
export const isProduction = () => {
  return process.env.NEXT_PUBLIC_ENVIRONMENT === "production";
};

export const EVENT_PACKAGE_ID =
  "0x6d2c1faa1b504cccad8c25d64aa7f288d6e3909a6ee79b6a78d69c4884ee913d";

export const EVENT_VISITOR_LIST_ID =
  "0xd8ef456b25f027a6c38025f2045cfcfa3dbe2c95f239d8255e4e998d6e4855b4";

export const DEMO_PACKAGE_ID =
  "0x107a2e58f6183d07b4b2e3988bc56857246494049aec7ae2e9501fd77e903e72";

export const DEMO_VISITOR_LIST_ID =
  "0x2cb0b8e45e84d0a0db650a86c798d133a88d074c0ff9ede72c97a1c4d4e5067d";

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
