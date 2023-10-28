export const isProduction = () => {
  return process.env.NEXT_PUBLIC_ENVIRONMENT === "production";
};

export const PACKAGE_ID =
  "0x3ba9c9d443c7b1654e1ea28abe4244cdca3b00791047adee5880cd30d965d91c";

export const VISITOR_LIST_ID =
  "0x7e7be3e045b3962732097d0d1a871696852380340e8a040d8c6091a1db885382";

export const CLOCK_ID = "0x6";

export const cocoObjectType = `${PACKAGE_ID}::nft::CoCoNFT`;

export const ZKLOGIN_ACCONTS = "zklogin-demo.accounts";
export const OBJECT_ID = "zklogin-demo.objectid";
export const ZKLOGIN_ADDRESS = "zklogin-demo.address";
export const ZKLOGIN_COLOR = "zklogin-demo.color";

export const EVENT_CODE = "zklogin";
