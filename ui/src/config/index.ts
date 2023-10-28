export const isProduction = () => {
  return process.env.NEXT_PUBLIC_ENVIRONMENT === "production";
};

export const PACKAGE_ID =
  "0x0e09b03dca17b1612acf615d19bffefb723e9feadbe36cb5788f35cfd31547dc";

export const VISITOR_LIST_ID =
  "0x29721446d01f403149759af40a199f5af620329ce43b1721e1af0b0750060bd6";

export const cocoObjectType = `${PACKAGE_ID}::nft::CoCoNFT`;

export const ZKLOGIN_ACCONTS = "zklogin-demo.accounts";
export const OBJECT_ID = "zklogin-demo.objectid";
export const ZKLOGIN_ADDRESS = "zklogin-demo.address";
