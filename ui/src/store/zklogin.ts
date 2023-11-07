import { suiClient } from "src/config/sui";
import { OpenIdProvider, zkLoginState } from "src/types";
import { create, StateCreator } from "zustand";
import { persist } from "zustand/middleware";
import config from "src/config/config.json";

import {
  generateNonce,
  generateRandomness,
  jwtToAddress,
} from "@mysten/zklogin";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { match } from "ts-pattern";
import { toBigIntBE } from "bigint-buffer";
import { decodeJwt } from "jose";

const MAX_EPOCH = 1; // keep ephemeral keys active for this many Sui epochs from now (1 epoch ~= 24h)

export const useZkLoginSetup = create<zkLoginState>(
  persist(
    (set, get) => ({
      provider: "Google",
      ephemeralPrivateKey: "",
      ephemeralPublicKey: "",
      maxEpoch: 0,
      randomness: "",
      nonce: "",
      loginUrl: () => {
        return getLoginUrl({
          nonce: get().nonce,
          provider: get().provider,
        });
      },
      userAddr: "",
      jwt: "",
      sub: "",
      aud: "",
      zkProofs: null,
      salt: () => "",
      isProofsLoading: false,
      beginZkLogin: async (provider) => {
        const { epoch } = await suiClient.getLatestSuiSystemState();
        const maxEpoch = Number(epoch) + MAX_EPOCH; // the ephemeral key will be valid for MAX_EPOCH from now
        const ephemeralKeyPair = new Ed25519Keypair();
        const randomness = generateRandomness();

        set({
          provider,
          maxEpoch,
          ephemeralPublicKey: toBigIntBE(
            Buffer.from(ephemeralKeyPair.getPublicKey().toSuiBytes())
          ).toString(),
          ephemeralPrivateKey: ephemeralKeyPair.export().privateKey,
          randomness,
        });

        const nonce = generateNonce(
          ephemeralKeyPair.getPublicKey() as any,
          maxEpoch,
          randomness
        );
        set({ randomness, nonce });
      },
      completeZkLogin: async (account) => {
        set({
          provider: account.provider as OpenIdProvider,
          maxEpoch: account.maxEpoch,
          ephemeralPublicKey: account.ephemeralPublicKey,
          ephemeralPrivateKey: account.ephemeralPrivateKey,
          randomness: account.randomeness,
        });

        if (!get().jwt) {
          get().getJwt();
          const userAddr = jwtToAddress(get().jwt, get().salt());
          set({ userAddr });
        }

        if (!account.zkProofs) {
          set({ isProofsLoading: true });
          const zkproofs = await getZkProof({
            maxEpoch: get().maxEpoch,
            jwtRandomness: get().randomness,
            extendedEphemeralPublicKey: get().ephemeralPublicKey,
            jwt: get().jwt,
            salt: get().salt(),
          });

          set({ zkProofs: zkproofs });
          set({ isProofsLoading: false });
        }
      },
      getJwt: () => {
        const urlFragment = window.location.hash.substring(1);
        const urlParams = new URLSearchParams(urlFragment);
        const jwt = urlParams.get("id_token");

        if (!jwt) {
          return;
        }
        window.history.replaceState(null, "", window.location.pathname); // remove URL fragment

        const jwtPayload = decodeJwt(jwt);
        if (!jwtPayload.sub || !jwtPayload.aud) {
          console.warn("[completeZkLogin] missing jwt.sub or jwt.aud");
          return;
        }

        set({
          jwt,
          sub: jwtPayload.sub,
          aud:
            typeof jwtPayload.aud === "string"
              ? jwtPayload.aud
              : jwtPayload.aud[0],
        });
      },
      account: () => ({
        provider: get().provider,
        userAddr: get().userAddr,
        zkProofs: get().zkProofs,
        ephemeralPublicKey: get().ephemeralPublicKey,
        ephemeralPrivateKey: get().ephemeralPrivateKey,
        userSalt: get().salt(),
        jwt: get().jwt,
        sub: get().sub,
        aud: get().aud,
        maxEpoch: get().maxEpoch,
        randomeness: get().randomness,
      }),
    }),
    {
      name: "zkLoginSetup",
      getStorage: () => localStorage,
      partialize: (state: zkLoginState) => ({
        // provider: state.provider,
        // userAddr: state.userAddr,
        // zkProofs: state.zkProofs,
        // ephemeralPublicKey: state.ephemeralPublicKey,
        // ephemeralPrivateKey: state.ephemeralPrivateKey,
        // userSalt: state.salt(),
        // jwt: state.jwt,
        // sub: state.sub,
        // aud: state.aud,
        // maxEpoch: state.maxEpoch,
        // randomeness: state.randomness,
      }),
    }
  ) as StateCreator<zkLoginState, [], []>
);

const getLoginUrl = (props: { provider: OpenIdProvider; nonce: string }) => {
  const REDIRECT_URI = window.location.origin + "/demo";
  const urlParamsBase = {
    nonce: props.nonce,
    state: new URLSearchParams({
      // redirect_uri: REDIRECT_URI,
      redirect_uri: `${REDIRECT_URI}`,
    }).toString(),
    //   redirect_uri: window.location.origin + "/login",
    redirect_uri: "https://zklogin-dev-redirect.vercel.app/api/auth",
    response_type: "id_token",
    scope: "openid",
  };

  const loginUrl = match(props.provider)
    .with("Google", () => {
      const urlParams = new URLSearchParams({
        ...urlParamsBase,
        client_id: config.CLIENT_ID_GOOGLE,
      });
      return `https://accounts.google.com/o/oauth2/v2/auth?${urlParams}`;
    })
    .with("Twitch", () => {
      const urlParams = new URLSearchParams({
        ...urlParamsBase,
        client_id: config.CLIENT_ID_TWITCH,
        force_verify: "true",
        lang: "en",
        login_type: "login",
      });
      return `https://id.twitch.tv/oauth2/authorize?${urlParams}`;
    })
    .with("Facebook", () => {
      const urlParams = new URLSearchParams({
        ...urlParamsBase,
        client_id: config.CLIENT_ID_FACEBOOK,
      });
      return `https://www.facebook.com/v18.0/dialog/oauth?${urlParams}`;
    })
    .exhaustive();

  return loginUrl;
};

const getZkProof = async (props: {
  maxEpoch: number;
  jwtRandomness: string;
  extendedEphemeralPublicKey: string;
  jwt: string;
  salt: string;
}) => {
  // azure
  // const url = "https://prover.umilabs.org/v1";
  // fly.io
  const url = "https://zklogin-prover-fe.fly.dev/v1";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      maxEpoch: props.maxEpoch,
      jwtRandomness: props.jwtRandomness,
      extendedEphemeralPublicKey: props.extendedEphemeralPublicKey,
      jwt: props.jwt,
      salt: props.salt,
      keyClaimName: "sub",
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const zkProofs = await response.json();
  return zkProofs;
};
