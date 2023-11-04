// ui/src/config/index.ts
export const isProduction = () => {
  return process.env.NEXT_PUBLIC_ENVIRONMENT === "production";
};

export const PACKAGE_ID =
  "0x40e91e8acaeab51d862f35ba278ab8f139db5fbd1c4bc1595625d2649651dc51";

export const VISITOR_LIST_ID =
  "0xd71d97dbb3f8e490e23452da539b4b3adbbc78a2b4963dead2e7935b855cc34d";

export const CLOCK_ID = "0x6";

export const cocoObjectType = `${PACKAGE_ID}::nft::CoCoNFT`;

export const ZKLOGIN_ACCONTS = `zklogin-demo.accounts`;

export const EVENT_CODE = "zklogin";
