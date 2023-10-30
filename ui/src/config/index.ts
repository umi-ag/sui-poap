export const isProduction = () => {
  return process.env.NEXT_PUBLIC_ENVIRONMENT === "production";
};

export const PACKAGE_ID =
  "0x14dbb0365ad440759d5754894f3de15d082187bcd25fa01812ae2cbdf41b1ab6";

export const VISITOR_LIST_ID =
  "0xbd1d18c3fd6e9b0a02e96501a664f17d6e7bc33badb1306fe20d7f797f1766a5";

export const CLOCK_ID = "0x6";

export const cocoObjectType = `${PACKAGE_ID}::nft::CoCoNFT`;

export const ZKLOGIN_ACCONTS = "zklogin-demo.accounts";
export const OBJECT_ID = "zklogin-demo.objectid";
export const ZKLOGIN_ADDRESS = "zklogin-demo.address";
export const ZKLOGIN_COLOR = "zklogin-demo.color";

export const EVENT_CODE = "zklogin";
