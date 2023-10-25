import CryptoJS from "crypto-js";

/**
 * アドレスを短く表示するためのメソッド
 * @param address
 * @param digits
 * @returns
 */
export const shortenAddress = (
  address: string,
  digits = 4,
): string => {
  if (!address) return "";
  const len = address.length;
  const start = address.startsWith("0x") ? "0x" : "";
  if (len <= (digits * 2) + start.length) {
    return address;
  }
  return `${start + address.slice(start.length, start.length + digits)}...${
    address.slice(len - digits)
  }`;
};

export const generateOneTimeCode = () => {
  const date = new Date();
  const currentMinute = date.getMinutes();

  // 現在の「分」を基にして秘密のキーとともにハッシュを生成
  const secretKey = "YOUR_SECRET_KEY"; // これは変更して、安全な場所に保管してください
  const hash = CryptoJS.HmacSHA256(currentMinute.toString(), secretKey);

  // ハッシュの結果をmodulo 1000000で処理して、6桁の数字に制限
  const oneTimeCode = (parseInt(hash.toString(CryptoJS.enc.Hex), 16) % 1000000)
    .toString().padStart(6, "0");

  return oneTimeCode;
};

export const hashWithSHA256 = (code: string) => {
  return CryptoJS.SHA256(code).toString(CryptoJS.enc.Hex);
};
