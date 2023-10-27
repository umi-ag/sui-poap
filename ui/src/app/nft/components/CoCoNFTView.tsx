// ui/src/components/CoCoNFT.tsx
"use client";

import ThreeScene from "./ThreeScene";

export interface CoCoNFTProps {
  l1: number;
  l2: number;
  l3: number;
  r1: number;
  r2: number;
  r3: number;
}

export const CoCoNFTView = ({ l1, l2, l3, r1, r2, r3 }: CoCoNFTProps) => {
  const toHexColor = (num: number) =>
    parseInt("0x" + num.toString(16).padStart(6, "0"), 16);

  console.log({ l1 });
  console.log({ l2 });
  console.log({ l3 });
  console.log({ r1 });

  const props = {
    l1: toHexColor(l1),
    l2: toHexColor(l2),
    l3: toHexColor(l3),
    r1: toHexColor(r1),
    r2: toHexColor(r2),
    r3: toHexColor(r3),
    date: "2023/10/30",
    num: "#000",
  };

  return (
    <div>
      {/* @ts-ignore */}
      <ThreeScene {...props} />
    </div>
  );
};
