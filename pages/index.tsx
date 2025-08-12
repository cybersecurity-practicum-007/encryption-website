"use client";

import { useEffect, useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";
import Image from "next/image";
import { useCryptoStore } from "@/stores/variables";

interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  delta: number;
}

export default function Home() {
  const plaintext   = useCryptoStore((s: { plaintext: any; }) => s.plaintext);
  const setPlain    = useCryptoStore((s: { setPlaintext: any; }) => s.setPlaintext);
  const runCrypto   = useCryptoStore((s: { runCrypto: any; }) => s.runCrypto);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const result      = useCryptoStore((s: { result: any; }) => s.result);
  const isBusy      = useCryptoStore((s: { isBusy: any; }) => s.isBusy);
  const error       = useCryptoStore((s: { error: any; }) => s.error);
  const isEncrypt   = useCryptoStore((s: { isEncrypt: any; }) => s.isEncrypt);
  const methodStr   = useCryptoStore((s: { methodStr: any; }) => s.methodStr);


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const STAR_COUNT = 200;
    const stars: Star[] = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random(),
      delta: Math.random() * 0.02 + 0.005,
    }));

    function drawStar(s: Star) {
      ctx!.beginPath();
      ctx!.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx!.fillStyle = `rgba(250, 235, 146, ${s.alpha})`;
      ctx!.fill();
    }

    let animId: number;
    const animate = () => {
      ctx!.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        drawStar(s);
        //shining!
        s.alpha += s.delta;
        if (s.alpha <= 0 || s.alpha >= 1) s.delta *= -1;
      }
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {}
      <div className="absolute inset-0 bg-gradient-to-b from-[#9929EA] to-[#CC66DA]" />
      {}
      <canvas ref={canvasRef} className="absolute inset-0" />
      {}
      <Image
        src="/static/images/homes.svg"
        alt="city"
        width={500}
        height={200}
        className="absolute bottom-0 right-0 pointer-events-none"
      />
      <Image
        src="/static/images/sun.svg"
        alt="Sun"
        width={100}
        height={100}
        className="absolute bottom-200 left-20 -translate-x-1/2 pointer-events-none"
      />

      {}
      <div
        className="
          absolute
          top-1/2 left-1/2
          transform -translate-x-1/2 -translate-y-1/2
          flex flex-col items-center space-y-6
          px-4
          z-10
        "
      >
        <p className="text-2xl font-semibold text-black">Enter your text:</p>
        {/* Used drop in library from react for handling the text input growth. 
         * <input> can't grow tall and stays as one row, 
         * so we either have to use <textarea> auto resize with a hook, or use TextareaAutosize
         */}
        <TextareaAutosize
          minRows={1}
          maxRows={6}
          value={plaintext}
          onChange={(e: { target: { value: any; }; }) => setPlain(e.target.value)}
          placeholder="Type here…"
          className="
            w-150
            px-4
            py-2
            resize-none
            rounded-lg
            bg-white bg-opacity-80 text-gray-900
            placeholder-gray-600
            focus:outline-none focus:ring-2 focus:ring-pink-300
          "
        />
        <div className="flex space-x-4">
          <button onClick={() => runCrypto(true)} className="px-6 py-2 bg-yellow-200 rounded-full font-medium hover:bg-yellow-300 transition">
            Encrypt
          </button>
          <button onClick={() => runCrypto(false)} className="px-6 py-2 bg-white text-gray-800 rounded-full font-medium hover:bg-gray-100 transition">
            Decrypt
          </button>
        </div>
        <div className="mt-4 w-full max-w-[38rem]">
            <p className="text-sm text-gray-800">
              {isEncrypt ? "Encrypted" : "Decrypted"} with{" "}
              <span className="font-semibold">{methodStr.toUpperCase()}</span>:
            </p>

            {isBusy && <p className="text-sm text-gray-600 mt-1">Working…</p>}
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}

            {!isBusy && !error && (
              <pre className="mt-2 bg-white/80 p-3 rounded-lg break-all">
                {result || " "}
              </pre>
            )}
          </div>
      </div>
    </div>
  );
}