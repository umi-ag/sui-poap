"use client";

import ThreeScene from "@/components/ThreeScene";

export default function Coin() {
  const colors = JSON.parse(localStorage.getItem("colors"));
  console.log({ colors });
  console.log(colors.l1);
  const hexColors = {
    l1: "0x" + colors.l1.toString(16).padStart(6, "0"),
    l2: "0x" + colors.l2.toString(16).padStart(6, "0"),
    l3: "0x" + colors.l3.toString(16).padStart(6, "0"),
    r1: "0x" + colors.r1.toString(16).padStart(6, "0"),
    r2: "0x" + colors.r2.toString(16).padStart(6, "0"),
    r3: "0x" + colors.r3.toString(16),
  };

  const props = {
    l1: parseInt(hexColors.l1, 16),
    l2: parseInt(hexColors.l2, 16),
    l3: parseInt(hexColors.l3, 16),
    r1: parseInt(hexColors.r1, 16),
    r2: parseInt(hexColors.r2, 16),
    r3: parseInt(hexColors.r3, 16),
    date: "2023/10/20",
    num: "#000",
  };
  return (
    <div>
      <ThreeScene props={props} />
    </div>
  );
}
