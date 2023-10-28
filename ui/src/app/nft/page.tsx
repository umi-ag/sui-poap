// frontend/src/app/coin/page.tsx
"use client";

import ThreeScene from "./components/ThreeScene";
import React, { useEffect, useState } from "react";
import { useZkLoginSetup } from "src/store/zklogin";
import style from "../styles/login.module.css";
import { shortenAddress } from "src/utils";
import { ZKLOGIN_ACCONTS, OBJECT_ID, ZKLOGIN_ADDRESS } from "src/config";

export default function Coin() {
  const zkLoginSetup = useZkLoginSetup();
  const [colors, setColors] = useState(null);
  const [objectId, setObjectId] = useState(null);
  const [address, setAddress] = useState(null);

  useEffect(() => {
    // @ts-ignore
    const localColors = JSON.parse(localStorage.getItem("colors"));
    setColors(localColors);
    // @ts-ignore
    const obj_id = JSON.parse(localStorage.getItem(OBJECT_ID));
    console.log({ obj_id });
    setObjectId(obj_id);

    // @ts-ignore
    const addr = JSON.parse(localStorage.getItem(ZKLOGIN_ADDRESS));
    console.log({ addr });
    setAddress(addr);
  }, []);

  if (!colors) return null;
  // @ts-ignore
  // const colors = JSON.parse(localStorage.getItem("colors"));
  // console.log({ colors });
  // console.log(colors.l1);
  const hexColors = {
    // @ts-ignore
    l1: "0x" + colors.l1.toString(16).padStart(6, "0"),
    // @ts-ignore
    l2: "0x" + colors.l2.toString(16).padStart(6, "0"),
    // @ts-ignore
    l3: "0x" + colors.l3.toString(16).padStart(6, "0"),
    // @ts-ignore
    r1: "0x" + colors.r1.toString(16).padStart(6, "0"),
    // @ts-ignore
    r2: "0x" + colors.r2.toString(16).padStart(6, "0"),
    // @ts-ignore
    r3: "0x" + colors.r3.toString(16),
  };

  const props = {
    l1: parseInt(hexColors.l1, 16),
    l2: parseInt(hexColors.l2, 16),
    l3: parseInt(hexColors.l3, 16),
    r1: parseInt(hexColors.r1, 16),
    r2: parseInt(hexColors.r2, 16),
    r3: parseInt(hexColors.r3, 16),
    date: "2023/10/30",
    num: "Suiブロックチェーンの\n     ここがすごい",
  };
  return (
    <div className="">
      <div style={{ position: "absolute", color: "white", width: "100vw" }}>
        <div>
          <p
            className={`${style.mySpecialFont} mt-10 text-center text-white text-3xl font-bold leading-9`}
          >
            Thank you for coming!
          </p>
        </div>
        <div className="flex flex-col">
          <div className="flex justify-center">
            <p
              className={`${style.mySpecialFont} mt-5 text-center text-white text-2xl font-bold leading-9`}
            >
              Your Address:
            </p>
            {address && (
              <b
                className={`${style.mySpecialFont} mt-5 text-center text-white text-2xl font-bold leading-9 ml-2`}
              >
                {" "}
                <a
                  className="text-blue-400 underline"
                  href={`https://suiscan.xyz/mainnet/account/${address}/tx-blocks`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {/* @ts-ignore */}
                  {shortenAddress(address)}
                </a>
              </b>
            )}
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex justify-center">
            <p
              className={`${style.mySpecialFont} mt-5 text-center text-white text-2xl font-bold leading-9`}
            >
              ObjectId:
            </p>
            {objectId && (
              <b
                className={`${style.mySpecialFont} mt-5 text-center text-white text-2xl font-bold leading-9 ml-2`}
              >
                {" "}
                <a
                  className="text-blue-400 underline"
                  href={`https://suiscan.xyz/mainnet/object/${objectId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {/* @ts-ignore */}
                  {shortenAddress(objectId)}
                </a>
              </b>
            )}
          </div>
        </div>
      </div>
      <div className="mt-30">
        <ThreeScene props={props} />
      </div>
    </div>
  );
}
