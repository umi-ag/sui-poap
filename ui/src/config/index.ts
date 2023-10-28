export const isProduction = () => {
  return process.env.NEXT_PUBLIC_ENVIRONMENT === "production";
};

export const PACKAGE_ID =
  "0xe41269e692f2fd6928863efd718854b7ce1b3437179b260cafa65005761648e0";

export const VISITOR_LIST_ID =
  "0x82266c7b36fd0b520175c1ccfd2ed32544453d183592cb7cdb35e429783f6b2a";

export const cocoObjectType = `${PACKAGE_ID}::nft::CoCoNFT`;
