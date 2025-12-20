"use client";

import React, { useState, useEffect, useRef } from "react";
import { DollarSign, Plus, Minus, RotateCcw } from "lucide-react";

interface HistoryEntry {
  id: number;
  bet: number;
  guess: string;
  result: string;
  won: boolean;
  payout: number;
  timestamp: string;
}

export default function RetroCoinFlipGame() {
  const [balance, setBalance] = useState(10000);
  const [betAmount, setBetAmount] = useState(100);
  const [selectedSide, setSelectedSide] = useState<"heads" | "tails">("heads");
  const [isFlipping, setIsFlipping] = useState(false);
  const [coinSide, setCoinSide] = useState<"heads" | "tails">("heads");
  const [lastResult, setLastResult] = useState<"heads" | "tails" | null>(null);
  const [resultMessage, setResultMessage] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [flipCount, setFlipCount] = useState(0);

  const coinFlipAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    coinFlipAudioRef.current = new Audio("/sounds/coinflip.mp3");
    coinFlipAudioRef.current.volume = 0.5;
  }, []);

  const flipCoin = async () => {
    if (balance < betAmount) return;

    setIsFlipping(true);
    setResultMessage("");
    setBalance((prev) => prev - betAmount);

    if (coinFlipAudioRef.current) {
      try {
        coinFlipAudioRef.current.currentTime = 0;
        await coinFlipAudioRef.current.play();
      } catch (error) {
        console.log("Audio playback failed");
      }
    }

    const result = Math.random() < 0.5 ? "heads" : "tails";

    let animationFrames = 0;
    const flipAnimation = setInterval(() => {
      setCoinSide(animationFrames % 2 === 0 ? "heads" : "tails");
      animationFrames++;

      if (animationFrames >= 20) {
        clearInterval(flipAnimation);
        setCoinSide(result);
        setLastResult(result);

        const won = selectedSide === result;
        const payout = won ? betAmount * 2 : 0;

        if (won) {
          setBalance((prev) => prev + payout);
          setResultMessage(`WINNER! +$${betAmount}`);
        } else {
          setResultMessage(`CRASHED! -$${betAmount}`);
        }

        const newEntry = {
          id: Date.now(),
          bet: betAmount,
          guess: selectedSide,
          result: result,
          won: won,
          payout: payout,
          timestamp: new Date().toLocaleTimeString(),
        };

        setHistory((prev) => [newEntry, ...prev.slice(0, 9)]);
        setFlipCount((prev) => prev + 1);
        setIsFlipping(false);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-black p-4 font-mono relative overflow-hidden text-yellow-400">
      {/* CRT SCANLINE EFFECT */}
      <div className="fixed inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.1),rgba(0,0,0,0.1)_1px,transparent_1px,transparent_2px)] z-50"></div>

      <div className="max-w-sm mx-auto space-y-6 relative z-10">
        {/* Header - Matching Monadcade Title */}
        <div className="bg-black border-4 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)] p-4">
          <h1 className="text-xl font-black text-yellow-400 text-center tracking-tighter [text-shadow:2px_2px_0_#dc2626]">
            {">"} COIN_FLIP_V1.0
          </h1>
        </div>

        {/* Balance Display */}
        <div className="bg-zinc-900 border-2 border-yellow-400 shadow-[4px_4px_0px_0px_#dc2626] p-4 text-center">
          <h2 className="text-[10px] font-black text-green-400 tracking-widest uppercase">
            Available Credits
          </h2>
          <p className="text-4xl font-black text-white">
            ${balance.toLocaleString()}
          </p>
          {resultMessage && (
            <div
              className={`mt-2 p-2 border-2 font-black animate-pulse ${
                resultMessage.includes("WINNER")
                  ? "bg-green-600 border-white text-white"
                  : "bg-red-600 border-black text-white"
              }`}
            >
              {resultMessage}
            </div>
          )}
        </div>

        {/* Coin Display Area */}
        <div className="bg-zinc-900 border-4 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)] p-8">
          <div className="text-center relative">
            <div className="relative mb-6">
              <div
                className={`
                  w-32 h-32 mx-auto rounded-full border-8 border-black shadow-[0_0_25px_rgba(168,85,247,0.6)]
                  flex items-center justify-center text-5xl transition-all duration-100
                  ${isFlipping ? "animate-spin opacity-80" : ""}
                  ${coinSide === "heads" ? "bg-yellow-400" : "bg-cyan-400"}
                `}
              >
                {coinSide === "heads" ? "👑" : "🦅"}
              </div>
              {/* Retro Glow behind coin */}
              <div
                className={`absolute inset-0 blur-3xl rounded-full -z-10 ${
                  coinSide === "heads" ? "bg-yellow-400/20" : "bg-cyan-400/20"
                }`}
              ></div>
            </div>

            <div className="inline-block bg-black border-2 border-yellow-400 px-6 py-2">
              <span className="text-2xl font-black text-yellow-400 tracking-widest">
                {coinSide.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Bet Controls */}
        <div className="bg-zinc-900 border-2 border-cyan-400 p-4 shadow-[4px_4px_0px_0px_#0891b2]">
          <h3 className="text-[10px] font-black text-cyan-400 mb-3 tracking-widest">
            SET WAGER
          </h3>

          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setBetAmount(Math.max(10, betAmount - 10))}
              disabled={isFlipping}
              className="bg-black border-2 border-cyan-400 p-2 text-cyan-400 hover:bg-cyan-400 hover:text-black active:translate-y-1 transition-all"
            >
              <Minus className="w-4 h-4" />
            </button>

            <input
              type="number"
              value={betAmount}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 0;
                setBetAmount(Math.max(10, Math.min(balance, value)));
              }}
              disabled={isFlipping}
              className="bg-black border-2 border-yellow-400 px-4 py-2 flex-1 text-center text-xl font-black text-yellow-400 focus:outline-none"
              min="10"
              max={balance}
            />

            <button
              onClick={() => setBetAmount(Math.min(balance, betAmount + 10))}
              disabled={isFlipping}
              className="bg-black border-2 border-cyan-400 p-2 text-cyan-400 hover:bg-cyan-400 hover:text-black active:translate-y-1 transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[50, 100, 250, 500].map((amount) => (
              <button
                key={amount}
                onClick={() => setBetAmount(amount)}
                disabled={isFlipping}
                className={`
                  py-2 font-black text-[10px] border-2 transition-all
                  ${
                    betAmount === amount
                      ? "bg-yellow-400 text-black border-black shadow-none translate-y-1"
                      : "bg-black text-yellow-400 border-yellow-400 shadow-[2px_2px_0px_#000] hover:bg-yellow-400/10"
                  }
                `}
              >
                ${amount}
              </button>
            ))}
          </div>
        </div>

        {/* Side Selection */}
        <div className="bg-zinc-900 border-2 border-yellow-400 p-4 shadow-[4px_4px_0px_0px_#dc2626]">
          <h3 className="text-[10px] font-black text-yellow-400 mb-3 tracking-widest text-center uppercase">
            Choose Destiny
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setSelectedSide("heads")}
              disabled={isFlipping}
              className={`
                py-4 border-4 transition-all flex flex-col items-center gap-1
                ${
                  selectedSide === "heads"
                    ? "bg-yellow-400 text-black border-white shadow-none translate-y-1"
                    : "bg-black text-yellow-400 border-yellow-400 shadow-[4px_4px_0px_#000] opacity-60"
                }
              `}
            >
              <span className="text-3xl">👑</span>
              <span className="font-black italic">HEADS</span>
            </button>

            <button
              onClick={() => setSelectedSide("tails")}
              disabled={isFlipping}
              className={`
                py-4 border-4 transition-all flex flex-col items-center gap-1
                ${
                  selectedSide === "tails"
                    ? "bg-cyan-400 text-black border-white shadow-none translate-y-1"
                    : "bg-black text-cyan-400 border-cyan-400 shadow-[4px_4px_0px_#000] opacity-60"
                }
              `}
            >
              <span className="text-3xl">🦅</span>
              <span className="font-black italic">TAILS</span>
            </button>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={flipCoin}
          disabled={isFlipping || balance < betAmount}
          className={`
            w-full py-5 font-black text-2xl border-4 border-black transition-all relative
            ${
              !isFlipping && balance >= betAmount
                ? "bg-red-600 text-white shadow-[0_8px_0_#000] hover:shadow-[0_4px_0_#000] hover:translate-y-1 active:shadow-none active:translate-y-2"
                : "bg-zinc-800 text-zinc-600 cursor-not-allowed border-zinc-900"
            }
          `}
        >
          <span className="[text-shadow:2px_2px_0_#000]">
            {isFlipping
              ? "PROCESSING..."
              : balance >= betAmount
              ? "CONFIRM FLIP"
              : "LOW CREDITS"}
          </span>
        </button>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-black border-2 border-zinc-700 p-2 text-center">
            <p className="text-[8px] font-bold text-zinc-500 uppercase">
              Flips
            </p>
            <p className="text-sm font-black text-white">{flipCount}</p>
          </div>
          <div className="bg-black border-2 border-zinc-700 p-2 text-center">
            <p className="text-[8px] font-bold text-zinc-500 uppercase">Rate</p>
            <p className="text-sm font-black text-green-400">
              {flipCount > 0
                ? `${Math.round(
                    (history.filter((h) => h.won).length / flipCount) * 100
                  )}%`
                : "0%"}
            </p>
          </div>
          <div className="bg-black border-2 border-zinc-700 p-2 text-center">
            <p className="text-[8px] font-bold text-zinc-500 uppercase">
              Multiplier
            </p>
            <p className="text-sm font-black text-purple-400">2.00x</p>
          </div>
        </div>

        {/* History Log */}
        {history.length > 0 && (
          <div className="bg-black border-2 border-zinc-800 p-4 space-y-2">
            <h3 className="text-[10px] font-black text-zinc-500 mb-2 tracking-widest uppercase">
              Transaction History
            </h3>
            <div className="space-y-1 max-h-32 overflow-y-auto pr-2">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="flex justify-between items-center text-[10px] font-mono border-b border-zinc-900 pb-1"
                >
                  <span
                    className={entry.won ? "text-green-500" : "text-red-500"}
                  >
                    {entry.won ? "[WIN]" : "[LOSE]"}{" "}
                    {entry.result.toUpperCase()}
                  </span>
                  <span className="text-zinc-600">{entry.timestamp}</span>
                  <span className="text-white">${entry.bet}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotateY(0deg) scale(1);
          }
          50% {
            transform: rotateY(180deg) scale(1.2);
          }
          100% {
            transform: rotateY(360deg) scale(1);
          }
        }
        .animate-spin {
          animation: spin 0.15s linear infinite;
        }
      `}</style>
    </div>
  );
}
