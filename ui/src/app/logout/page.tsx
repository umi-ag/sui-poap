"use client";

import React from "react";
import {
  DEMO_ZKLOGIN_ACCONTS,
  DEMO_OBJECT_ID,
  DEMO_ZKLOGIN_ADDRESS,
  DEMO_ZKLOGIN_COLOR,
} from "src/config";

export default function Home() {
  const removeItem = (key: string) => {
    localStorage.removeItem(key);
  };

  return (
    <div className="flex flex-row gap-5">
      <h1>Remove data from local storage</h1>
      <button onClick={() => removeItem(DEMO_ZKLOGIN_ACCONTS)}>
        ZKLOGIN_ACCONTS
      </button>
      <button
        onClick={() => {
          removeItem(DEMO_OBJECT_ID);
          console.log("objectid deleted!");
        }}
      >
        OBJECT_ID
      </button>
      <button onClick={() => removeItem(DEMO_ZKLOGIN_ADDRESS)}>
        ZKLOGIN_ADDRESS
      </button>
    </div>
  );
}
