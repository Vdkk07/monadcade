"use client";

import React, { useState, useEffect, useRef } from "react";
import { Plus, Minus, Zap } from "lucide-react";

// Use a class or object outside of state for smooth physics
interface BallObj {
  x: number;
  y: number;
  vx: number;
  vy: number;
  active: boolean;
  rowPassed: number;
}

export default function RetroPlinkoGame() {
  const [balance, setBalance] = useState(10000);
  const [betAmount, setBetAmount] = useState(100);
  const [isDropping, setIsDropping] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [resultMessage, setResultMessage] = useState("");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballsRef = useRef<BallObj[]>([]); // Physics lives here, not in State
  const pinsRef = useRef<{ x: number; y: number; row: number }[]>([]);

  const ROWS = 12;
  const MULTIPLIERS = [16, 8, 4, 2, 0.5, 0.3, 0.5, 2, 4, 8, 16];

  // 1. Initialize Board
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = 320;
    canvas.height = 450;

    // Calculate Pins once
    const pins: { x: number; y: number; row: number }[] = [];
    const spacingX = canvas.width / (ROWS + 1);
    const spacingY = (canvas.height - 120) / ROWS;

    for (let r = 0; r < ROWS; r++) {
      const pinsInRow = r + 2;
      const rowY = 50 + r * spacingY;
      for (let c = 0; c < pinsInRow; c++) {
        const x =
          canvas.width / 2 - (pinsInRow - 1) * (spacingX / 2) + c * spacingX;
        pins.push({ x, y: rowY, row: r });
      }
    }
    pinsRef.current = pins;

    // Start Animation Loop
    let animationId: number;
    const ctx = canvas.getContext("2d");

    const loop = () => {
      if (ctx) update(ctx, canvas.width, canvas.height);
      animationId = requestAnimationFrame(loop);
    };
    loop();

    return () => cancelAnimationFrame(animationId);
  }, []);

  // 2. Physics Engine (Runs outside React render cycle)
  const update = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    ctx.clearRect(0, 0, width, height);

    // Draw Pins
    ctx.fillStyle = "#facc15";
    pinsRef.current.forEach((pin) => {
      ctx.beginPath();
      ctx.arc(pin.x, pin.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw Buckets
    const slotWidth = width / MULTIPLIERS.length;
    MULTIPLIERS.forEach((m, i) => {
      ctx.fillStyle = i % 2 === 0 ? "#dc2626" : "#facc15";
      ctx.fillRect(i * slotWidth + 2, height - 30, slotWidth - 4, 25);
      ctx.fillStyle = "white";
      ctx.font = "bold 8px monospace";
      ctx.fillText(`${m}x`, i * slotWidth + slotWidth / 4, height - 15);
    });

    // Update Balls
    ballsRef.current.forEach((ball, index) => {
      if (!ball.active) return;

      ball.vy += 0.25; // Gravity
      ball.x += ball.vx;
      ball.y += ball.vy;

      // Collision Detection
      pinsRef.current.forEach((pin) => {
        const dx = ball.x - pin.x;
        const dy = ball.y - pin.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 10) {
          // Ball radius + pin radius
          const angle = Math.atan2(dy, dx);
          const speed = Math.sqrt(ball.vx ** 2 + ball.vy ** 2);
          ball.vx = Math.cos(angle) * 2.5 + (Math.random() - 0.5);
          ball.vy = Math.abs(Math.sin(angle) * 2.5);
        }
      });

      // Handle Landing
      if (ball.y > height - 40) {
        ball.active = false;
        const bucket = Math.floor(ball.x / slotWidth);
        const mult =
          MULTIPLIERS[Math.max(0, Math.min(bucket, MULTIPLIERS.length - 1))];
        finalizeDrop(mult);
      }

      // Draw Ball
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#a855f7";
      ctx.fillStyle = "#a855f7";
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  };

  const finalizeDrop = (multiplier: number) => {
    const payout = Math.round(betAmount * multiplier);
    setBalance((prev) => prev + payout);
    setResultMessage(`${multiplier}x ${multiplier >= 1 ? "WIN!" : ""}`);
    setHistory((prev) => [
      {
        id: Date.now(),
        multiplier,
        payout,
        timestamp: new Date().toLocaleTimeString(),
      },
      ...prev.slice(0, 5),
    ]);
    setIsDropping(false);
  };

  const dropBall = () => {
    if (balance < betAmount || isDropping) return;
    setIsDropping(true);
    setBalance((prev) => prev - betAmount);
    setResultMessage("");

    // Add ball to physics ref
    ballsRef.current = [
      {
        x: 160 + (Math.random() * 4 - 2),
        y: 20,
        vx: Math.random() - 0.5,
        vy: 0,
        active: true,
        rowPassed: 0,
      },
    ];
  };

  return (
    <div className="min-h-screen bg-black p-4 font-mono relative overflow-hidden text-yellow-400">
      <div className="fixed inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.1),rgba(0,0,0,0.1)_1px,transparent_1px,transparent_2px)] z-50"></div>

      <div className="max-w-sm mx-auto space-y-4 relative z-10">
        <div className="bg-black border-4 border-yellow-400 p-3 shadow-[0_0_15px_#facc15]">
          <h1 className="text-xl font-black text-center tracking-tighter">
            PLINKO_ULTRA_60FPS
          </h1>
        </div>

        <div className="bg-zinc-900 border-2 border-yellow-400 p-4 text-center shadow-[4px_4px_0_#dc2626]">
          <h2 className="text-[10px] text-green-400 uppercase font-black">
            Credits
          </h2>
          <p className="text-3xl font-black text-white">
            ${balance.toLocaleString()}
          </p>
          {resultMessage && (
            <div className="mt-2 text-white bg-red-600 border-2 border-black py-1 animate-bounce uppercase text-xs">
              {resultMessage}
            </div>
          )}
        </div>

        <div className="bg-zinc-900 border-4 border-green-500 p-2 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
          <canvas
            ref={canvasRef}
            className="w-full h-auto bg-black border-2 border-zinc-800"
          />
        </div>

        <div className="bg-zinc-900 border-2 border-cyan-400 p-4 shadow-[4px_4px_0_#0891b2]">
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setBetAmount(Math.max(10, betAmount - 10))}
              className="bg-black border-2 border-cyan-400 p-2 text-cyan-400"
            >
              {" "}
              -{" "}
            </button>
            <div className="flex-1 text-center text-xl font-black text-yellow-400 border-2 border-yellow-400 bg-black py-1">
              ${betAmount}
            </div>
            <button
              onClick={() => setBetAmount(betAmount + 10)}
              className="bg-black border-2 border-cyan-400 p-2 text-cyan-400"
            >
              {" "}
              +{" "}
            </button>
          </div>
        </div>

        <button
          onClick={dropBall}
          disabled={isDropping || balance < betAmount}
          className={`w-full py-4 font-black text-xl border-4 border-black transition-all
            ${
              !isDropping
                ? "bg-red-600 text-white shadow-[0_6px_0_#000] hover:translate-y-1 active:translate-y-2"
                : "bg-zinc-800 text-zinc-500"
            }`}
        >
          {isDropping ? "PROCESSING..." : "🎯 DROP BALL 🎯"}
        </button>
      </div>
    </div>
  );
}
