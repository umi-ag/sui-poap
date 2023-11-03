export const isProduction = () => {
  return process.env.NEXT_PUBLIC_ENVIRONMENT === "production";
};

export const PACKAGE_ID =
  "0x6d2c1faa1b504cccad8c25d64aa7f288d6e3909a6ee79b6a78d69c4884ee913d";

export const VISITOR_LIST_ID =
  "0xd8ef456b25f027a6c38025f2045cfcfa3dbe2c95f239d8255e4e998d6e4855b4";

export const CLOCK_ID = "0x6";

export const cocoObjectType = `${PACKAGE_ID}::nft::CoCoNFT`;

export const ZKLOGIN_ACCONTS = "zklogin-demo.accounts";
export const OBJECT_ID = "zklogin-demo.objectid";
export const ZKLOGIN_ADDRESS = "zklogin-demo.address";
export const ZKLOGIN_COLOR = "zklogin-demo.color";

export const EVENT_CODE = "zklogin";
