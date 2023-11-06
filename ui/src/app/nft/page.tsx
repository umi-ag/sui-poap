// ui/src/app/[id]/page.tsx
"use client";

import ThreeScene from "src/components/ThreeScene";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useZkLoginSetup } from "src/store/zklogin";
import style from "src/app/styles/login.module.css";
import { shortenAddress } from "src/utils";
import { cocoObjectType } from "src/config";
import type { ColorsType } from "src/types";
import { updateColors } from "src/utils/getColor";
import { getOwnedCocoObjectId } from "src/utils/getObject";
import { NETWORK } from "src/config/sui";

export default function Coin() {
  const router = useRouter();
  const zkLoginSetup = useZkLoginSetup();
  const [objectId, setObjectId] = useState<string | null>(null);
  const [colors, setColors] = useState<ColorsType | null>(null);

  useEffect(() => {
    const getObject = async () => {
      const obj_id = await getOwnedCocoObjectId(
        zkLoginSetup.userAddr,
        cocoObjectType
      );
      setObjectId(obj_id);

      if (!zkLoginSetup.userAddr || !obj_id) {
        router.push("/");
        return;
      }
      setColors(updateColors(obj_id));
    };
    getObject();
  }, []);

  if (!colors) return null;
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
    date: "2023/10/30",
    num: "Suiブロックチェーンの\n     ここがすごい",
  };
  return (
    <div className="">
      <div style={{ position: "absolute", color: "white", width: "100vw" }}>
        <div className="flex flex-col mt-10">
          <div className="flex flex-col justify-center">
            {/* <p
              className={`${style.mySpecialFont} mt-5 text-center text-white text-2xl font-bold leading-9`}
            >
              Sui POAP <span className="text-2xl">by</span> zkLogin & Sponsored
              Transaction
            </p> */}
            <p
              className={`${style.mySpecialFont} text-center text-white text-4xl mt-5`}
            >
              Sui POAP
            </p>
            <p
              className={`${style.mySpecialFont} mt-5 text-center text-white text-3xl font-bold leading-9`}
            >
              <span className="text-2xl">by</span> zkLogin & Sponsored
              Transaction,
              <br />
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
            {zkLoginSetup.userAddr && (
              <b
                className={`${style.mySpecialFont} mt-5 text-center text-white text-2xl font-bold leading-9 ml-2`}
              >
                {" "}
                <a
                  className="text-blue-400 underline"
                  href={`https://suiscan.xyz/${NETWORK}/account/${zkLoginSetup.userAddr}/tx-blocks`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {shortenAddress(zkLoginSetup.userAddr)}
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
                  href={`https://suiscan.xyz/${NETWORK}/object/${objectId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
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
              src="/logo.png"
              alt="Umi Labs Logo"
              style={{ height: "1.25em" }}
            />
          </div>
        </p>
      </div>
    </div>
  );
}
