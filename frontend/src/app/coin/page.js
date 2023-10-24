"use client";

import ThreeScene from "@/components/ThreeScene";

export default function coin() {
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

  console.log(hexColors);
  console.log(hexColors.l2);
  const props = {
    l1: 0xff7e4c, //colors.l1, // 0x43ddf4dff, //0xffd1dc,
    l2: 0xaec6cf, //hexColors.l2, // 0xaec6cf,
    l3: parseInt(hexColors.l3, 16),
    r1: 0xaec6cf, //colors.r1, // 0xbfd3c1,
    r2: 0xbfd3c1, //colors.r2, // 0xfff5b2,
    r3: hexColors.r3, // 0xffb347,
    date: "2023/10/20",
    num: "#000",
  };
  return (
    <div>
      <ThreeScene props={props} />
    </div>
  );
}
