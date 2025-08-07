import { useEffect, useRef } from "react";
import Image from "next/image";

interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  delta: number;
}

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
        alt="Cacti"
        width={500}
        height={200}
        className="absolute bottom-0 left-370 -translate-x-1/2 pointer-events-none"
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
        <input
          type="text"
          placeholder="Type here…"
          className="
            w-150
            h-50
            px-4
            pt-4 pb-1
            leading-none
            rounded-lg
            bg-white bg-opacity-80 text-gray-900
            placeholder-gray-600
            focus:outline-none focus:ring-2 focus:ring-pink-300
          "
        />
        <div className="flex space-x-4">
          <button className="px-6 py-2 bg-yellow-200 rounded-full font-medium hover:bg-yellow-300 transition">
            Encrypt
          </button>
          <button className="px-6 py-2 bg-white text-gray-800 rounded-full font-medium hover:bg-gray-100 transition">
            Decrypt
          </button>
        </div>
      </div>
    </div>
  );
}