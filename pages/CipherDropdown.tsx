"use client";

import { useState, useRef, useEffect } from "react";
import { useCryptoStore } from "@/stores/variables";
import { createPortal } from "react-dom";

// Define the structure of each selectable cipher.  Disabled entries will appear
// greyed‑out and cannot be selected until their implementations are added.
type Option = { label: string; value: string; disabled: boolean };

// Options are grouped by high level category (classical vs modern), then by
// subcategory, and finally by family.  
const cipherOptions: {
  classical: {
    substitution: {
      monoalphabetic: Option[];
      polyalphabetic: Option[];
      polygraphic: Option[];
    };
    transposition: {
      monoalphabetic: Option[];
      polyalphabetic: Option[];
    };
  };
  modern: {
    block: Option[];
    stream: Option[];
  };
} = {
  classical: {
    substitution: {
      monoalphabetic: [
        { label: "Rot13 (Caesar cipher)", value: "rot13", disabled: false },
        { label: "Caesar cipher", value: "caesar", disabled: true },
        { label: "Affine cipher", value: "affine", disabled: false },
        { label: "Atbash cipher", value: "atbash", disabled: false },
      ],
      polyalphabetic: [
        { label: "Vigenère cipher", value: "vigenere", disabled: true },
        { label: "Beaufort cipher", value: "beaufort", disabled: true },
      ],
      polygraphic: [
        { label: "Playfair cipher", value: "playfair", disabled: false },
        { label: "Hill cipher", value: "hill", disabled: true },
      ],
    },
    transposition: {
      monoalphabetic: [
        { label: "Caesar cipher", value: "caesar", disabled: true },
        { label: "Affine cipher", value: "affine", disabled: true },
        { label: "Atbash cipher", value: "atbash", disabled: true },
      ],
      polyalphabetic: [
        { label: "Vigenère cipher", value: "vigenere", disabled: true },
        { label: "Beaufort cipher", value: "beaufort", disabled: true },
      ],
    },
  },
  modern: {
    block: [
      { label: "AES", value: "aes", disabled: true },
      { label: "DES", value: "des", disabled: true },
      { label: "3DES", value: "3des", disabled: true },
      { label: "IDEA", value: "idea", disabled: true },
      { label: "Blowfish", value: "blowfish", disabled: true },
    ],
    stream: [
      { label: "ISAAC", value: "isaac", disabled: true },
      { label: "RC4", value: "rc4", disabled: true },
      { label: "Salsa20", value: "salsa20", disabled: true },
      { label: "ChaCha20", value: "chacha20", disabled: true },
    ],
  },
};

/**
 * Helper to find the display label for the currently selected cipher.  If no
 * match is found, fall back to the raw value.  This is used to show the
 * currently selected cipher in the trigger button.
 */
function findLabel(value: string): string {
  for (const scope of Object.values(cipherOptions)) {
    for (const cat of Object.values(scope)) {
      if (Array.isArray(cat)) {
        const match = cat.find((o) => o.value === value);
        if (match) return match.label;
      } else {
        for (const family of Object.values(cat)) {
          const match = family.find((o) => o.value === value);
          if (match) return match.label;
        }
      }
    }
  }
  return value;
}

/**
 * Drop down component to select among cipher implementations.  When an entry
 * is chosen, it calls setMethodStr from the Zustand store and closes the
 * popover.  Disabled options are visibly grey and cannot be clicked.
 *
 * It uses a simple tab system to switch
 * between classical and modern algorithms.
 */
export default function CipherDropdown() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"classical" | "modern">(
    "classical"
  );

  const methodStr = useCryptoStore((s) => s.methodStr);
  const setMethodStr = useCryptoStore((s) => s.setMethodStr);

  const dropdownRef = useRef<HTMLDivElement>(null);

 

  /**
   * Handle a user selecting a cipher option.  When called, this will update
   * the global methodStr state and collapse the popover.
   */
  function handleSelect(value: string) {
    setMethodStr(value as any);
    setOpen(false);
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="
           w-56
           px-4
           py-2
           bg-white bg-opacity-80
           rounded-md
           flex items-center justify-between
           text-gray-800
           focus:outline-none focus:ring-2 focus:ring-pink-300
         "
      >
        <span className="truncate">
          {methodStr ? findLabel(methodStr) : "Select cipher"}
        </span>
        {/* Down arrow icon */}
        <svg
          className={`ml-2 transition-transform ${open ? "rotate-180" : ""}`}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {/* Popover */}
      {open && createPortal(
        <>
        {/* Full‑page blurred backdrop */}
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
        <div className="fixed 
          z-50 
          top-1/2 
          left-1/2 
          -translate-x-1/2 
          -translate-y-1/2 
          p-10 bg-white 
          bg-opacity-90 
          rounded-lg 
          shadow-xl 
          w-[59.5rem]">
          {/* Tabs */}
          <div className="flex mb-12 space-x-2 justify-center">
            {(["classical", "modern"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={
                  `
                   px-20 py-1 rounded-full text-xl font-medium
                   ${activeTab === tab ? "bg-black text-white border-2 border-amber-400 p-2" : "bg-gray-300 text-black"}
                 `
                }
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          {/* Scrollable content */}
          <div className="max-h-80 overflow-y-auto pr-1">
            {activeTab === "classical" && (
              <div className="flex gap-10">
                {/* Substitution */}
                <div flex-1 className="border-2 border-amber-400 p-4 rounded-lg ">
                  <p className="mb-5 text-black font-semibold text-3xl text-center">Substitution</p>
                  <div className="flex flex-wrap gap-2 ">
                    {Object.entries(cipherOptions.classical.substitution).map(
                      ([family, options]) => (
                        <div
                          key={family}
                          className="rounded-md overflow-hidden bg-gray-50 border border-gray-300"
                        >
                          <div className="bg-black text-white px-2 py-1 text-lg text-center capitalize">
                            {family}
                          </div>
                          <div className="flex flex-col">
                            {options.map((opt) => (
                              <button
                                key={opt.value}
                                type="button"
                                disabled={opt.disabled}
                                onClick={() => {
                                  if (!opt.disabled) handleSelect(opt.value);
                                }}
                                className={
                                  `
                                   px-3 py-1 text-sl text-left
                                   ${opt.disabled
                                     ? "cursor-not-allowed text-gray-400 bg-gray-200"
                                     : "cursor-pointer hover:bg-black hover:text-purple-400 bg-white text-gray-900 "}
                                 `
                                }
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
                {/* Transposition */}
                <div flex-1 className="border-2 border-amber-400 p-4 rounded-lg">
                  <p className="mb-5 text-black font-semibold text-3xl text-center" >Transposition</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(cipherOptions.classical.transposition).map(
                      ([family, options]) => (
                        <div
                          key={family}
                          className="rounded-md overflow-hidden bg-gray-50 border border-gray-300"
                        >
                          <div className="bg-black text-white px-2 py-1 text-lg text-center capitalize">
                            {family}
                          </div>
                          <div className="flex flex-col">
                            {options.map((opt) => (
                              <button
                                key={opt.value}
                                type="button"
                                disabled={opt.disabled}
                                onClick={() => {
                                  if (!opt.disabled) handleSelect(opt.value);
                                }}
                                className={
                                  `
                                   px-3 py-1 text-sl text-left
                                   ${opt.disabled
                                    ? "cursor-not-allowed text-gray-400 bg-gray-200"
                                    : "cursor-pointer hover:bg-black hover:text-purple-400 bg-white text-gray-900 "}
                                 `
                                }
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}
            {activeTab === "modern" && (
              <div className="space-y-3">
                {/* Block ciphers */}
                <div>
                  <p className="mb-1 text-gray-800 font-semibold">Block Ciphers</p>
                  <div className="grid grid-cols-2 gap-2">
                    {cipherOptions.modern.block.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        disabled={opt.disabled}
                        onClick={() => {
                          if (!opt.disabled) handleSelect(opt.value);
                        }}
                        className={
                          `
                           px-3 py-1 text-sm rounded-md
                           ${opt.disabled
                             ? "cursor-not-allowed text-gray-500 bg-gray-200"
                             : "cursor-pointer hover:bg-purple-100 bg-white text-gray-800 border border-gray-300"}
                         `
                        }
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Stream ciphers */}
                <div>
                  <p className="mb-1 text-gray-800 font-semibold">Stream Ciphers</p>
                  <div className="grid grid-cols-2 gap-2">
                    {cipherOptions.modern.stream.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        disabled={opt.disabled}
                        onClick={() => {
                          if (!opt.disabled) handleSelect(opt.value);
                        }}
                        className={
                          `
                           px-3 py-1 text-sm rounded-md
                           ${opt.disabled
                             ? "cursor-not-allowed text-gray-500 bg-gray-200"
                             : "cursor-pointer hover:bg-purple-100 bg-white text-gray-800 border border-gray-300"}
                         `
                        }
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        </>, 
        document.body
      )}
    </div>
  );
}