import { PACKAGE_ID, cocoObjectType } from "src/config";
import { ColorsType } from "src/types";

const splitObjectId = (objectId: string) => {
  const str = objectId.slice(2);
  const length = str.length;
  const partLength = Math.ceil(length / 6);
  const parts = [];

  for (let i = 0; i < 6; i++) {
    parts.push(str.slice(i * partLength, (i + 1) * partLength));
  }

  return parts;
};

export const updateColors = (objectId: string): ColorsType => {
  const parts = splitObjectId(objectId);
  console.log({ parts });
  return {
    l1: parseInt(parts[0], 16),
    l2: parseInt(parts[1], 16),
    l3: parseInt(parts[2], 16),
    r1: parseInt(parts[3], 16),
    r2: parseInt(parts[4], 16),
    r3: parseInt(parts[5], 16),
  };
};
