// ui/src/config/index.ts
export const isProduction = () => {
  return process.env.NEXT_PUBLIC_ENVIRONMENT === "production";
};

export const PACKAGE_ID =
  "0x798fc0076b8eb8ac1edc18fd6ec374241485ffc70d15970c958826ad8fe39687";

export const VISITOR_LIST_ID =
  "0x83b649755eab81ce614150c1390b29cb1c0e8d436eabc63b6f45d44ce07585db";

export const CLOCK_ID = "0x6";

export const cocoObjectType = `${PACKAGE_ID}::nft::CoCoNFT`;

export const ZKLOGIN_ACCONTS = `zklogin-${VISITOR_LIST_ID}.accounts`;
export const OBJECT_ID = `zklogin-${VISITOR_LIST_ID}.objectid`;
export const ZKLOGIN_ADDRESS = `zklogin-${VISITOR_LIST_ID}.address`;
export const ZKLOGIN_COLOR = `zklogin-${VISITOR_LIST_ID}.color`;

export const EVENT_CODE = "zklogin";
