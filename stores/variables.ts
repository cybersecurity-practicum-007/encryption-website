// stores/variables.ts
import { create } from "zustand";
import atbash from "../crypto/Atbash";
import rot13 from "../crypto/ROT13";

//Put your cipher here and it should work.
const CIPHERS = {
  rot13,
  atbash,
};

export type MethodName = keyof typeof CIPHERS;

type CryptoState = {
  plaintext: string;
  isEncrypt: boolean;
  methodStr: MethodName;
  result: string;
  isBusy: boolean;
  error?: string;

  setPlaintext: (s: string) => void;
  setIsEncrypt: (b: boolean) => void;
  toggleMode: () => void;
  setMethodStr: (m: MethodName) => void;

  // Accept optional boolean to force the mode on this run
  runCrypto: (forceMode?: boolean) => Promise<void>;
};

export const useCryptoStore = create<CryptoState>((set, get) => ({
  plaintext: "",
  isEncrypt: true,
  methodStr: "rot13",
  result: "",
  isBusy: false,
  error: undefined,

  setPlaintext: (plaintext: any) => set({ plaintext }),
  setIsEncrypt: (isEncrypt: any) => set({ isEncrypt }),
  toggleMode: () => set((s: { isEncrypt: any; }) => ({ isEncrypt: !s.isEncrypt })),
  setMethodStr: (m) => set({ methodStr: m }),

  runCrypto: async (forceMode: any) => {
    const { plaintext, isEncrypt: currentMode, methodStr } = get();
    const cipher = CIPHERS[methodStr];
    if (!cipher) {
      set({ error: `Unknown cipher: ${String(methodStr)}` });
      return;
    }
    const isEncrypt = typeof forceMode === "boolean" ? forceMode : currentMode;

    try {
      set({ isBusy: true, error: undefined });
      const output = isEncrypt
        ? await cipher.encrypt(plaintext)
        : await cipher.decrypt(plaintext);
      set({ result: output });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Encryption error";
      set({ error: message });
    } finally {
      set({ isBusy: false });
    }
  },
}));