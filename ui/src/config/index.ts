// ui/src/config/index.ts
export const isProduction = () => {
  return process.env.NEXT_PUBLIC_ENVIRONMENT === "production";
};

export const PACKAGE_ID =
  "0xe46fe94bef06641b2851f7e4eda2073b886aee36ab505d7a3d2161102e8489c5";

export const VISITOR_LIST_ID =
  "0x25ae7d6e711d0f0a1ee94bad8cf5eb7bdd2159299bf711ed6fb8e0bfa6a66e50";

export const CLOCK_ID = "0x6";

export const cocoObjectType = `${PACKAGE_ID}::nft::CoCoNFT`;

export const ZKLOGIN_ACCONTS = `zklogin-${PACKAGE_ID}.accounts`;
export const OBJECT_ID = `zklogin-${PACKAGE_ID}.objectid`;
export const ZKLOGIN_ADDRESS = `zklogin-${PACKAGE_ID}.address`;
export const ZKLOGIN_COLOR = `zklogin-${PACKAGE_ID}.color`;

export const EVENT_CODE = "zklogin";
