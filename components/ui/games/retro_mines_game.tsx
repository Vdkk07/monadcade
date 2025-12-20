"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Bomb,
  Diamond,
  RotateCcw,
  DollarSign,
  Zap,
  Plus,
  Minus,
} from "lucide-react";

export default function RetroMinesGame() {
  const [gridSize] = useState(25); // 5x5 grid
  const [mineCount, setMineCount] = useState(3);
  const [gameState, setGameState] = useState<
    "setup" | "playing" | "gameOver" | "won"
  >("setup");
  const [grid, setGrid] = useState<boolean[]>([]);
  const [revealedTiles, setRevealedTiles] = useState<Set<number>>(new Set());
  const [balance, setBalance] = useState(1000);
  const [stakeAmount, setStakeAmount] = useState(10);
  const [currentWinnings, setCurrentWinnings] = useState(0);
  const [diamondsFound, setDiamondsFound] = useState(0);

  const bombAudioRef = useRef<HTMLAudioElement | null>(null);
  const clickAudioRef = useRef<HTMLAudioElement | null>(null);
  const cashoutAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    bombAudioRef.current = new Audio("/sounds/bomb.mp3");
    bombAudioRef.current.volume = 0.6;
    cashoutAudioRef.current = new Audio("/sounds/cashout.mp3");
    cashoutAudioRef.current.volume = 0.6;
  }, []);

  const playClickSound = () => {
    try {
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.type = "sine";
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.1
      );
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      console.log("Click sound failed:", error);
    }
  };

  const getMultiplier = (mines: number) => {
    const multipliers: { [key: number]: number } = {
      1: 0.1,
      2: 0.2,
      3: 0.4,
      4: 0.6,
      5: 0.9,
      6: 1.2,
      7: 1.6,
      8: 2.1,
      9: 2.7,
      10: 3.5,
    };
    return multipliers[mines] || 0.4;
  };

  const initializeGame = () => {
    if (balance < stakeAmount) return;
    setBalance((prev) => prev - stakeAmount);
    const newGrid = Array(gridSize)
      .fill(null)
      .map(() => false);
    const minePositions = new Set();
    while (minePositions.size < mineCount) {
      const randomPos = Math.floor(Math.random() * gridSize);
      minePositions.add(randomPos);
    }
    minePositions.forEach((pos) => {
      newGrid[pos as number] = true;
    });
    setGrid(newGrid);
    setRevealedTiles(new Set());
    setGameState("playing");
    setCurrentWinnings(0);
    setDiamondsFound(0);
  };

  const handleTileClick = async (index: number) => {
    if (gameState !== "playing" || revealedTiles.has(index)) return;
    playClickSound();
    const newRevealed = new Set(revealedTiles);
    newRevealed.add(index);
    setRevealedTiles(newRevealed);

    if (grid[index]) {
      if (bombAudioRef.current) {
        try {
          bombAudioRef.current.currentTime = 0;
          await bombAudioRef.current.play();
        } catch (error) {
          console.log("Audio playback failed");
        }
      }
      setGameState("gameOver");
      const allMines = new Set<number>();
      grid.forEach((isMine, idx) => {
        if (isMine) allMines.add(idx);
      });
      setRevealedTiles((prev) =>
        new Set(Array.from(prev).concat(Array.from(allMines)))
      );
    } else {
      const newDiamonds = diamondsFound + 1;
      setDiamondsFound(newDiamonds);
      const multiplier = getMultiplier(mineCount);
      const newWinnings = Math.round(newDiamonds * multiplier * stakeAmount);
      setCurrentWinnings(newWinnings);
      if (newRevealed.size === gridSize - mineCount) {
        setGameState("won");
      }
    }
  };

  const cashOut = async () => {
    if (cashoutAudioRef.current) {
      try {
        cashoutAudioRef.current.currentTime = 0;
        await cashoutAudioRef.current.play();
      } catch (error) {
        console.log("Cashout failed");
      }
    }
    setBalance((prev) => prev + stakeAmount + currentWinnings);
    setGameState("setup");
  };

  const resetGame = () => {
    setGameState("setup");
    setRevealedTiles(new Set());
    setCurrentWinnings(0);
    setDiamondsFound(0);
  };

  const renderTile = (index: number) => {
    const isRevealed = revealedTiles.has(index);
    const isMine = grid[index];

    return (
      <button
        key={index}
        onClick={() => handleTileClick(index)}
        disabled={gameState !== "playing"}
        className={`
          aspect-square relative transition-all duration-100 font-black
          border-2 border-black
          ${
            isRevealed
              ? isMine
                ? "bg-red-600 shadow-[2px_2px_0px_#000] scale-95"
                : "bg-zinc-800 shadow-inner border-zinc-700"
              : "bg-zinc-700 hover:bg-zinc-600 shadow-[4px_4px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          }
        `}
      >
        {isRevealed && (
          <div className="absolute inset-0 flex items-center justify-center">
            {isMine ? (
              <span className="text-xl drop-shadow-[0_0_5px_rgba(255,0,0,0.8)]">
                💣
              </span>
            ) : (
              <img
                src="/monad.png"
                alt="Monad"
                className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]"
              />
            )}
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-black p-4 font-mono relative overflow-hidden text-yellow-400">
      {/* CRT SCANLINE EFFECT */}
      <div className="fixed inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.1),rgba(0,0,0,0.1)_1px,transparent_1px,transparent_2px)] z-50"></div>

      <div className="max-w-sm mx-auto space-y-6 relative z-10">
        {/* Header */}
        <div className="bg-black border-4 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)] p-4">
          <h1 className="text-xl font-black text-yellow-400 text-center tracking-tighter [text-shadow:2px_2px_0_#dc2626]">
            {">"} MONAD_MINES_V1.2
          </h1>
        </div>

        {/* Balance & Win Display */}
        <div className="bg-zinc-900 border-2 border-yellow-400 shadow-[4px_4px_0px_0px_#dc2626] p-4 flex justify-between items-center">
          <div>
            <h2 className="text-[10px] font-black text-green-400 tracking-widest uppercase">
              Credits
            </h2>
            <p className="text-2xl font-black text-white">
              ${balance.toLocaleString()}
            </p>
          </div>
          {currentWinnings > 0 && (
            <div className="bg-green-600 border-2 border-white px-3 py-1 animate-pulse">
              <p className="text-[10px] font-black text-white uppercase">Win</p>
              <p className="text-xl font-black text-white">
                +${currentWinnings}
              </p>
            </div>
          )}
        </div>

        {gameState === "setup" && (
          <div className="space-y-6">
            {/* Stake Selection */}
            <div className="bg-zinc-900 border-2 border-cyan-400 p-4 shadow-[4px_4px_0px_0px_#0891b2]">
              <h3 className="text-[10px] font-black text-cyan-400 mb-3 tracking-widest uppercase">
                Wager Amount
              </h3>
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={() => setStakeAmount(Math.max(5, stakeAmount - 5))}
                  className="bg-black border-2 border-cyan-400 p-2 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  value={stakeAmount}
                  readOnly
                  className="bg-black border-2 border-yellow-400 px-4 py-2 flex-1 text-center text-xl font-black text-yellow-400 focus:outline-none"
                  min="5"
                  max="500"
                />
                <button
                  onClick={() => setStakeAmount(Math.min(500, stakeAmount + 5))}
                  className="bg-black border-2 border-cyan-400 p-2 text-cyan-400 hover:bg-cyan-400 hover:text-black transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[5, 10, 25, 50, 100].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setStakeAmount(amount)}
                    className={`py-2 text-[10px] font-black border-2 transition-all ${
                      stakeAmount === amount
                        ? "bg-yellow-400 text-black border-black"
                        : "bg-black text-yellow-400 border-yellow-400"
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            </div>

            {/* Mine Count Selection */}
            <div className="bg-zinc-900 border-2 border-purple-500 p-4 shadow-[4px_4px_0px_0px_#a855f7]">
              <h3 className="text-[10px] font-black text-purple-400 mb-3 tracking-widest uppercase">
                Threat Level (Mines)
              </h3>
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={() => setMineCount(Math.max(1, mineCount - 1))}
                  className="bg-black border-2 border-purple-500 p-2 text-purple-400 hover:bg-purple-500 hover:text-black transition-all"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="flex-1 bg-black border-2 border-yellow-400 py-2 text-center">
                  <span className="text-xl font-black text-yellow-400">
                    {mineCount}
                  </span>
                  <span className="text-[10px] text-zinc-500 ml-2">
                    [{getMultiplier(mineCount)}x]
                  </span>
                </div>
                <button
                  onClick={() => setMineCount(Math.min(10, mineCount + 1))}
                  className="bg-black border-2 border-purple-500 p-2 text-purple-400 hover:bg-purple-500 hover:text-black transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              onClick={initializeGame}
              className="w-full py-5 font-black text-2xl border-4 border-black bg-red-600 text-white shadow-[0_8px_0_#000] hover:shadow-[0_4px_0_#000] hover:translate-y-1 active:translate-y-2 active:shadow-none transition-all"
            >
              <span className="[text-shadow:2px_2px_0_#000]">
                START OPERATION
              </span>
            </button>
          </div>
        )}

        {gameState !== "setup" && (
          <div className="space-y-6">
            <div className="bg-zinc-900 border-2 border-zinc-700 p-4 flex justify-around text-center">
              <div>
                <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">
                  Bombs
                </p>
                <p className="text-xl font-black text-red-500">{mineCount}</p>
              </div>
              <div>
                <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">
                  Monads
                </p>
                <p className="text-xl font-black text-green-400">
                  {diamondsFound}
                </p>
              </div>
              <div>
                <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">
                  Multiplier
                </p>
                <p className="text-xl font-black text-purple-400">
                  {getMultiplier(mineCount)}x
                </p>
              </div>
            </div>

            <div className="bg-black border-4 border-yellow-400 p-4 shadow-[0_0_20px_rgba(250,204,21,0.2)]">
              <div className="grid grid-cols-5 gap-2">
                {Array(gridSize)
                  .fill(null)
                  .map((_, index) => renderTile(index))}
              </div>
            </div>

            <div className="flex gap-4">
              {gameState === "playing" && currentWinnings > 0 && (
                <button
                  onClick={cashOut}
                  className="flex-1 bg-green-600 text-white py-4 font-black text-lg border-2 border-black shadow-[4px_4px_0px_#000] hover:brightness-110 transition-all"
                >
                  CASH OUT: ${stakeAmount + currentWinnings}
                </button>
              )}
              <button
                onClick={resetGame}
                className="bg-zinc-800 text-white p-4 border-2 border-black shadow-[4px_4px_0px_#000] hover:bg-zinc-700"
              >
                <RotateCcw className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

        {/* Game Over Modal */}
        {gameState === "gameOver" && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <div className="bg-black border-4 border-red-600 p-8 text-center max-w-xs w-full shadow-[0_0_50px_rgba(220,38,38,0.5)]">
              <div className="text-6xl mb-4 animate-bounce">💥</div>
              <h2 className="text-3xl font-black text-red-600 mb-2 tracking-tighter italic">
                CRASHED!
              </h2>
              <p className="text-zinc-400 text-xs mb-6 uppercase tracking-widest font-bold">
                Operation Failed: Sector Compromised
              </p>
              <button
                onClick={resetGame}
                className="w-full bg-red-600 text-white py-3 font-black border-2 border-black shadow-[4px_4px_0_#fff] active:shadow-none translate-y-[-2px]"
              >
                REBOOT SESSION
              </button>
            </div>
          </div>
        )}

        {/* Win Modal */}
        {gameState === "won" && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <div className="bg-black border-4 border-green-500 p-8 text-center max-w-xs w-full shadow-[0_0_50px_rgba(34,197,94,0.5)]">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-3xl font-black text-green-500 mb-2 tracking-tighter italic">
                SUCCESS!
              </h2>
              <p className="text-zinc-400 text-xs mb-6 uppercase tracking-widest font-bold">
                All Monads Extracted
              </p>
              <button
                onClick={() => {
                  cashOut();
                  resetGame();
                }}
                className="w-full bg-green-500 text-black py-3 font-black border-2 border-black shadow-[4px_4px_0_#fff]"
              >
                COLLECT ${stakeAmount + currentWinnings}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}