export const isProduction = () => {
  return process.env.NEXT_PUBLIC_ENVIRONMENT === "production";
};

export const PACKAGE_ID =
  "0x5b4c605c31c28e3b01a768c5de05266d3fdc4ad9f0e6f9330c38060af38ff0ab";

export const VISITOR_LIST_ID =
  "0x3136c22bb30c3e43d61d40cd2c412b257089b67f68a68a454404773b5f0359d3";

export const CLOCK_ID = "0x6";

export const cocoObjectType = `${PACKAGE_ID}::nft::CoCoNFT`;

export const ZKLOGIN_ACCONTS = "zklogin-demo.accounts";
export const OBJECT_ID = "zklogin-demo.objectid";
export const ZKLOGIN_ADDRESS = "zklogin-demo.address";
export const ZKLOGIN_COLOR = "zklogin-demo.color";

export const EVENT_CODE = "zklogin";
