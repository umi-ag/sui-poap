import dayjs from "dayjs";

export const convertTimestampToDate = (timestamp: string): string => {
  return dayjs(parseInt(timestamp, 10)).format("YYYY/MM/DD");
};

export const insertNewLines = (text: string, everyNChars: number): string => {
  let result = "";
  for (let i = 0; i < text.length; i += everyNChars) {
    const nextChunk = text.substring(i, i + everyNChars);
    result += nextChunk + "\n";
  }
  return result.trim();
};
