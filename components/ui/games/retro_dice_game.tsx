"use client";

import React, { useState, useEffect, useRef } from "react";
import { Plus, Minus, TrendingUp, TrendingDown } from "lucide-react";

interface HistoryEntry {
  id: number;
  roll: number;
  bet: number;
  target: number;
  type: string;
  won: boolean;
  payout: number;
  timestamp: string;
}

export default function RetroDiceGame() {
  const [balance, setBalance] = useState(10000);
  const [betAmount, setBetAmount] = useState(100);
  const [targetNumber, setTargetNumber] = useState(50);
  const [betType, setBetType] = useState<"over" | "under">("over");
  const [lastRoll, setLastRoll] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [currentRoll, setCurrentRoll] = useState(50.0);

  const diceAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    diceAudioRef.current = new Audio("/sounds/dice.mp3");
    diceAudioRef.current.volume = 0.6;
  }, []);

  const getWinChance = () => {
    return betType === "over" ? 100 - targetNumber : targetNumber;
  };

  const getMultiplier = () => {
    const winChance = getWinChance();
    return parseFloat((98 / winChance).toFixed(2));
  };

  const getPayout = () => {
    return (betAmount * getMultiplier()).toFixed(2);
  };

  const rollDice = async () => {
    if (balance < betAmount) return;

    setIsRolling(true);
    setBalance((prev) => prev - betAmount);

    if (diceAudioRef.current) {
      try {
        diceAudioRef.current.currentTime = 0;
        await diceAudioRef.current.play();
      } catch (error) {
        console.log("Audio failed");
      }
    }

    let animationCount = 0;
    const rollAnimation = setInterval(() => {
      setCurrentRoll(Math.random() * 100);
      animationCount++;

      if (animationCount >= 20) {
        clearInterval(rollAnimation);
        const finalRoll = Math.random() * 100;
        setCurrentRoll(finalRoll);
        setLastRoll(finalRoll);

        const won =
          betType === "over"
            ? finalRoll > targetNumber
            : finalRoll < targetNumber;

        if (won) {
          const payout = parseFloat(getPayout());
          setBalance((prev) => prev + payout);
        }

        const newEntry = {
          id: Date.now(),
          roll: finalRoll,
          bet: betAmount,
          target: targetNumber,
          type: betType,
          won: won,
          payout: won ? parseFloat(getPayout()) : 0,
          timestamp: new Date().toLocaleTimeString(),
        };

        setHistory((prev) => [newEntry, ...prev.slice(0, 9)]);
        setIsRolling(false);
      }
    }, 50);
  };

  return (
    <div className="min-h-screen bg-black p-4 font-mono relative overflow-hidden text-yellow-400">
      {/* CRT SCANLINE EFFECT */}
      <div className="fixed inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.15),rgba(0,0,0,0.15)_1px,transparent_1px,transparent_2px)] z-50"></div>

      <div className="max-w-sm mx-auto space-y-6 relative z-10">
        {/* Header */}
        <div className="bg-black border-4 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)] p-4">
          <h1 className="text-xl font-black text-yellow-400 text-center tracking-tighter [text-shadow:2px_2px_0_#dc2626]">
            {">"} DICE_ROLL_V1.2
          </h1>
        </div>

        {/* Balance Display */}
        <div className="bg-zinc-900 border-2 border-yellow-400 shadow-[4px_4px_0px_0px_#dc2626] p-4 text-center">
          <h2 className="text-[10px] font-black text-green-400 tracking-widest uppercase">
            Credits
          </h2>
          <p className="text-4xl font-black text-white">
            ${balance.toLocaleString()}
          </p>
        </div>

        {/* Roll Display Area */}
        <div className="bg-zinc-900 border-4 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3)] p-6">
          <div className="text-center">
            <div
              className={`text-6xl mb-4 ${isRolling ? "animate-bounce" : ""}`}
            >
              🎲
            </div>
            <div className="bg-black border-2 border-yellow-400 p-4 mb-2 shadow-inner">
              <span className="text-5xl font-black text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]">
                {currentRoll.toFixed(2)}
              </span>
            </div>
            {lastRoll !== null && !isRolling && (
              <div
                className={`text-sm font-black uppercase tracking-widest ${
                  (lastRoll > targetNumber && betType === "over") ||
                  (lastRoll < targetNumber && betType === "under")
                    ? "text-green-400"
                    : "text-red-500"
                }`}
              >
                Result: {lastRoll.toFixed(2)}
              </div>
            )}
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
              className="bg-black border-2 border-cyan-400 p-2 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              value={betAmount}
              onChange={(e) =>
                setBetAmount(Math.max(10, parseInt(e.target.value) || 0))
              }
              className="bg-black border-2 border-yellow-400 px-4 py-2 flex-1 text-center text-xl font-black text-yellow-400 focus:outline-none min-w-1"
            />
            <button
              onClick={() => setBetAmount(Math.min(balance, betAmount + 10))}
              className="bg-black border-2 border-cyan-400 p-2 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Target Slider & Type */}
        <div className="bg-zinc-900 border-2 border-yellow-400 p-4 shadow-[4px_4px_0px_0px_#dc2626]">
          <h3 className="text-[10px] font-black text-yellow-400 mb-3 tracking-widest text-center uppercase italic">
            Probability Config
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <button
              onClick={() => setBetType("over")}
              className={`py-3 border-4 transition-all flex items-center justify-center gap-2 ${
                betType === "over"
                  ? "bg-yellow-400 text-black border-white shadow-[0_0_10px_#facc15]"
                  : "bg-black text-yellow-400 border-yellow-400 opacity-60"
              }`}
            >
              <TrendingUp className="w-4 h-4" /> OVER
            </button>
            <button
              onClick={() => setBetType("under")}
              className={`py-3 border-4 transition-all flex items-center justify-center gap-2 ${
                betType === "under"
                  ? "bg-cyan-400 text-black border-white shadow-[0_0_10px_#22d3ee]"
                  : "bg-black text-cyan-400 border-cyan-400 opacity-60"
              }`}
            >
              <TrendingDown className="w-4 h-4" /> UNDER
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTargetNumber(Math.max(1, targetNumber - 1))}
                className="bg-black text-white border-2 border-white p-2 hover:bg-white hover:text-black transition-all"
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="flex-1 text-center bg-black border-2 border-yellow-400 py-2 text-2xl font-black text-yellow-400 [text-shadow:0_0_5px_#facc15]">
                {targetNumber.toString().padStart(2, "0")}
              </div>
              <button
                onClick={() => setTargetNumber(Math.min(99, targetNumber + 1))}
                className="bg-black text-white border-2 border-white p-2 hover:bg-white hover:text-black transition-all"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* INCREASE BAR / SLIDER */}
            <div className="relative pt-2">
              <input
                type="range"
                min="1"
                max="99"
                value={targetNumber}
                onChange={(e) => setTargetNumber(parseInt(e.target.value))}
                className="retro-slider w-full h-4 bg-zinc-800 appearance-none cursor-pointer border-2 border-black"
              />
              <div className="flex justify-between mt-2 font-black text-[8px] text-zinc-500 uppercase tracking-tighter">
                <span>Min_01</span>
                <span>Mid_50</span>
                <span>Max_99</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-black border-2 border-zinc-700 p-2 text-center">
            <p className="text-[8px] font-bold text-zinc-500 uppercase">
              Win Chance
            </p>
            <p className="text-sm font-black text-green-400">
              {getWinChance().toFixed(1)}%
            </p>
          </div>
          <div className="bg-black border-2 border-zinc-700 p-2 text-center">
            <p className="text-[8px] font-bold text-zinc-500 uppercase">
              Multiplier
            </p>
            <p className="text-sm font-black text-purple-400">
              {getMultiplier()}x
            </p>
          </div>
          <div className="bg-black border-2 border-zinc-700 p-2 text-center">
            <p className="text-[8px] font-bold text-zinc-500 uppercase">
              Payout
            </p>
            <p className="text-sm font-black text-white">${getPayout()}</p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={rollDice}
          disabled={isRolling || balance < betAmount}
          className={`w-full py-5 font-black text-2xl border-4 border-black transition-all relative ${
            !isRolling && balance >= betAmount
              ? "bg-red-600 text-white shadow-[0_8px_0_#000] hover:shadow-[0_4px_0_#000] hover:translate-y-1 active:shadow-none active:translate-y-2"
              : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
          }`}
        >
          <span className="[text-shadow:2px_2px_0_#000]">
            {isRolling
              ? "SIMULATING..."
              : balance >= betAmount
              ? "EXECUTE ROLL"
              : "LOW CREDITS"}
          </span>
        </button>

        {/* History Log */}
        {history.length > 0 && (
          <div className="bg-black border-2 border-zinc-800 p-4 space-y-2">
            <h3 className="text-[10px] font-black text-zinc-500 mb-2 tracking-widest uppercase">
              System Log
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
                    [{entry.won ? "SUCCESS" : "FAIL"}] {entry.roll.toFixed(2)}
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
        .retro-slider {
          background: linear-gradient(
            to right,
            ${betType === "over" ? "#facc15" : "#22d3ee"} 0%,
            ${betType === "over" ? "#facc15" : "#22d3ee"} ${targetNumber}%,
            #18181b ${targetNumber}%,
            #18181b 100%
          );
        }

        /* Webkit (Chrome, Safari, Edge) */
        .retro-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 28px;
          background: #ffffff;
          border: 3px solid #000000;
          box-shadow: 4px 0px 0px #dc2626;
          cursor: pointer;
        }

        /* Firefox */
        .retro-slider::-moz-range-thumb {
          width: 16px;
          height: 28px;
          background: #ffffff;
          border: 3px solid #000000;
          box-shadow: 4px 0px 0px #dc2626;
          cursor: pointer;
          border-radius: 0;
        }
      `}</style>
    </div>
  );
}
