export const convertTimestampToDate = (timestamp: string): string => {
  const date = new Date(parseInt(timestamp, 10));
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}/${month}/${day}`;
};

export const insertNewLines = (text: string, everyNChars: number): string => {
  let result = "";
  for (let i = 0; i < text.length; i += everyNChars) {
    const nextChunk = text.substring(i, i + everyNChars);
    result += nextChunk + "\n";
  }
  return result.trim();
};
