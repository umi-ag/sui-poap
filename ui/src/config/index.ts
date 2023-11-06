// ui/src/config/index.ts
export const isProduction = () => {
  return process.env.NEXT_PUBLIC_ENVIRONMENT === "production";
};

export const PACKAGE_ID =
  "0x8fff73c650ca09e3fc21bdad276375b609ff041c66c2541c3543a2d69aa33e30";

export const EVENT_CONFIG_ID =
  "0x45e70a10bfe074f8be8f52483b87f5bafedc8c6084894874feb1ed0c6d5a22a3";

export const CLOCK_ID = "0x6";

export const cocoObjectType = `${PACKAGE_ID}::nft::CoCoNFT`;

export const ZKLOGIN_ACCONTS = `zklogin-demo.accounts`;

export const EVENT_CODE = "zklogin";

export const EVENT_KEY = "movejp10";
