// ui/src/app/nft/page.tsx
"use client";

import ThreeScene from "./components/ThreeScene";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useZkLoginSetup } from "src/store/zklogin";
import style from "../styles/login.module.css";
import { shortenAddress } from "src/utils";
import {
  ZKLOGIN_ACCONTS,
  OBJECT_ID,
  ZKLOGIN_ADDRESS,
  ZKLOGIN_COLOR,
} from "src/config";

export default function Coin() {
  const router = useRouter();
  const zkLoginSetup = useZkLoginSetup();
  const [colors, setColors] = useState(null);
  const [objectId, setObjectId] = useState(null);
  const [address, setAddress] = useState(null);

  useEffect(() => {
    // @ts-ignore
    const addr = JSON.parse(localStorage.getItem(ZKLOGIN_ADDRESS));
    console.log({ addr });
    // @ts-ignore
    const obj_id = JSON.parse(localStorage.getItem(OBJECT_ID));
    console.log({ obj_id });
    if (!addr || !obj_id) {
      router.push("/");
    }
    setAddress(addr);
    // @ts-ignore
    const localColors = JSON.parse(localStorage.getItem(ZKLOGIN_COLOR));
    setColors(localColors);
    setObjectId(obj_id);
  }, []);

  if (!colors) return null;
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
        <div className="flex flex-col mt-1">
          <div className="flex justify-center">
            <p
              className={`${style.mySpecialFont} mt-5 text-center text-white text-2xl font-bold leading-9`}
            >
              Sui POAP <span className="text-2xl">by</span> zkLogin & Sponsored
              Transaction
            </p>
          </div>
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
        <div className="flex flex-col">
          <div className="flex justify-center">
            <p
              className={`${style.mySpecialFont} mt-5 text-center text-white text-2xl font-bold leading-9`}
            >
              Link:
            </p>
            <b
              className={`${style.mySpecialFont} mt-5 text-center text-white text-2xl font-bold leading-9 ml-2`}
            >
              <a
                className="text-blue-400 underline"
                href="https://links.umilabs.org/movejp2310"
                target="_blank"
                rel="noopener noreferrer"
              >
                links.umilabs.org/movejp2310
              </a>
            </b>
          </div>
        </div>
      </div>
      <div className="mt-30">
        <ThreeScene props={props} />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          right: "10px",
          color: "white",
        }}
      >
        <p
          className={`${style.mySpecialFont} mt-5 ml-2 text-center text-white text-2xl font-bold leading-9`}
        >
          <div className="flex items-center mt-5 ml-2 text-center text-white text-2xl font-bold leading-9 gap-2">
            <span className="text-xl">presented by</span> Umi Labs
            <img
              src="/logo_v4.png"
              alt="Umi Labs Logo"
              style={{ height: "1.25em" }}
            />
          </div>
        </p>
      </div>
    </div>
  );
}
