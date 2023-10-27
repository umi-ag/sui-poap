export const isProduction = () => {
  return process.env.NEXT_PUBLIC_ENVIRONMENT === "production";
};

export const PACKAGE_ID =
  "0x8a6dc43e0b98279f47f4f4187a981846059d9e9b981001916ecdc082e124e7e5";

export const cocoObjectType = `${PACKAGE_ID}::my_nft::CoCoNFT`;
