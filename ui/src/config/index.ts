export const isProduction = () => {
  return process.env.NEXT_PUBLIC_ENVIRONMENT === "production";
};

export const PACKAGE_ID =
  "0x1abf7cebdcee33232b8391da3cd156fc8d59ac1ad0010e6b23ced9bf6098bb6f";

export const VISITOR_LIST_ID =
  "0x98d14406ac55df0ad03e6605244b700af46b229dfbf6f6ac811bf520ce21c332";

export const cocoObjectType = `${PACKAGE_ID}::nft::CoCoNFT`;

export const ZKLOGIN_ACCONTS = "zklogin-demo.accounts";
export const OBJECT_ID = "zklogin-demo.objectid";
export const ZKLOGIN_ADDRESS = "zklogin-demo.address";
export const ZKLOGIN_COLOR = "zklogin-demo.color";
