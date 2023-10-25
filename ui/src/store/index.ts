import { VerifierInputs } from "src/types";
import { create } from "zustand";

export const usePasscodeStore = create<{
  passcode: string;
  setPasscode: (message: string) => void;
}>((set) => ({
  passcode: "",
  setPasscode: (passcode: string) => set({ passcode }),
}));

export const useClaimabledObjectId = create<{
  objectId: string;
  setObjectId: (message: string) => void;
}>((set) => ({
  objectId: "",
  setObjectId: (objectId: string) => set({ objectId }),
}));

export const useVerifierInputsStore = create<{
  verifierInputs: VerifierInputs,
  setVerifierInputs: (props: VerifierInputs) => void;
}>((set) => ({
  verifierInputs: {
    vk: "",
    public_inputs: "",
    proof_points: "",
  },
  setVerifierInputs: (verifierInputs: VerifierInputs) => set({ verifierInputs }),
}));
