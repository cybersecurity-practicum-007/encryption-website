// stores/variables.ts
import { create } from "zustand";

// Common interface your crypto modules implement
export interface CryptoMethod {
  encrypt: (s: string) => Promise<string>;
  decrypt: (s: string) => Promise<string>;
}

// Dynamic loaders for each method module
const methodLoaders = {
    rot13: () => import("../crypto/ROT13").then(m => m.default),

} satisfies Record<string, () => Promise<CryptoMethod>>;

type MethodName = keyof typeof methodLoaders;

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
  //TODO: change it to the method get from the dropdown menu
  methodStr: "rot13",
  result: "",
  isBusy: false,
  error: undefined,

  setPlaintext: (plaintext: any) => set({ plaintext }),
  setIsEncrypt: (isEncrypt: any) => set({ isEncrypt }),
  toggleMode: () => set((s: { isEncrypt: any; }) => ({ isEncrypt: !s.isEncrypt })),
  setMethodStr: (methodStr: any) => set({ methodStr }),

  runCrypto: async (forceMode: any) => {
    const { plaintext, isEncrypt: currentMode, methodStr } = get();
    const isEncrypt = typeof forceMode === "boolean" ? forceMode : currentMode;

    set({ isBusy: true, error: undefined });
    try {
      const impl = await methodLoaders[methodStr]();
      const out = isEncrypt
        ? await impl.encrypt(plaintext)
        : await impl.decrypt(plaintext);

      // Persist mode we actually ran with
      set({ result: out, isEncrypt });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Crypto error";
      set({ error: msg });
    } finally {
      set({ isBusy: false });
    }
  },
}));