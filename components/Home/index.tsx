"use client";

import { FarcasterActions } from "@/components/Home/FarcasterActions";
import { User } from "@/components/Home/User";
import { WalletActions } from "@/components/Home/WalletActions";
import { NotificationActions } from "./NotificationActions";
import { Dialog, DialogContent, DialogTrigger } from "@/components/dialog";
import RetroCoinFlipGame from "@/components/ui/games/retro_coinflip_game";
import RetroPlinkoGame from "../ui/games/retro_plinko_game";
import RetroMinesGame from "@/components/ui/games/retro_mines_game";
import RetroDiceGame from "../ui/games/retro_dice_game";

export function Demo() {
  return (
    <div className="min-h-screen bg-black font-mono relative">
      {/* RETRO SCANLINE OVERLAY */}
      <div className="fixed inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.05),rgba(0,0,0,0.05)_1px,transparent_1px,transparent_2px)] z-50"></div>

      {/* Retro Header - Purple/Yellow Arcade Style */}
      <header className="border-b-4 border-yellow-400 bg-black shadow-[0px_4px_15px_rgba(250,204,21,0.3)]">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-400 border-2 border-black shadow-[2px_2px_0px_0px_rgba(220,38,38,1)] flex items-center justify-center animate-pulse">
              <span className="text-black font-black text-xl">🎰</span>
            </div>
            <div>
              <h1 className="text-xl font-black text-yellow-400 tracking-wider [text-shadow:2px_2px_0_#dc2626]">
                MONADCADE
              </h1>
              <p className="text-[10px] font-black text-green-400 uppercase">
                ⚡ Powering Consumer Apps
              </p>
            </div>
          </div>
          <div className="bg-black border-2 border-yellow-400 shadow-[2px_2px_0px_0px_#dc2626] px-3 py-2">
            <span className="font-black text-yellow-400 tracking-tighter">
              💰 $1,247.00
            </span>
          </div>
        </div>
      </header>

      {/* Main Content - Black Arcade Background */}
      <main className="px-4 py-6 space-y-6 bg-black">
        {/* User Context Section (Unchanged Logic) */}
        <div className="bg-zinc-900 border-2 border-yellow-400 p-2">
          <User />
        </div>

        {/* Welcome Banner */}
        <div className="text-center space-y-3">
          <div className="bg-red-600 border-2 border-black shadow-[4px_4px_0px_0px_#facc15] p-4 mx-4">
            <h2 className="text-2xl font-black text-white tracking-wider animate-pulse">
              🕹️ INSERT COIN 🕹️
            </h2>
          </div>
        </div>

        {/* Games Section - Same Structure as your working code */}
        <section className="space-y-6">
          {/* Coin Flip Game */}
          <div className="bg-zinc-900 border-4 border-purple-500 shadow-[6px_6px_0px_0px_rgba(168,85,247,0.4)] p-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-purple-500 border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center">
                <span className="text-3xl">🪙</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-black text-purple-400 tracking-wide">
                    COIN FLIP
                  </h3>
                  <div className="bg-yellow-400 border-2 border-black px-2 py-1">
                    <span className="text-xs font-black text-black tracking-tighter">
                      2X PAYOUT
                    </span>
                  </div>
                </div>
                <p className="text-xs font-black text-gray-400 uppercase mb-2">
                  Heads or Tails Betting
                </p>
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <button className="w-full h-12 bg-purple-600 border-2 border-black shadow-[4px_4px_0px_0px_#000] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all font-black text-white text-lg tracking-widest">
                  ▶ START FLIPPING ◀
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-[100vw] max-h-[100vh] w-full h-full bg-black border-4 border-yellow-400 p-0 m-0 overflow-hidden">
                <div className="h-full overflow-y-auto bg-black text-white">
                  <div className="p-4 bg-yellow-400 text-black font-black flex justify-between items-center">
                    <span>COIN FLIP</span>
                  </div>
                  <RetroCoinFlipGame />
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Plinko Game - NEW UNIQUE CARD */}
          <div className="bg-zinc-900 border-4 border-pink-500 shadow-[6px_6px_0px_0px_rgba(236,72,153,0.4)] p-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-pink-500 border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center">
                <span className="text-3xl text-white">🎯</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-black text-pink-400 tracking-wide">
                    PLINKO
                  </h3>
                  <div className="bg-green-400 border-2 border-black px-2 py-1 text-black">
                    <span className="text-xs font-black tracking-tighter">
                      16X MAX
                    </span>
                  </div>
                </div>
                <p className="text-xs font-black text-gray-400 uppercase mb-2">
                  Gravity-Based Multipliers
                </p>
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <button className="w-full h-12 bg-pink-600 border-2 border-black shadow-[4px_4px_0px_0px_#000] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all font-black text-white text-lg tracking-widest">
                  ▶ DROP THE BALL ◀
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-[100vw] max-h-[100vh] w-full h-full bg-black border-4 border-yellow-400 p-0 m-0 overflow-hidden">
                <div className="h-full overflow-y-auto bg-black text-white">
                  <div className="p-4 bg-yellow-400 text-black font-black flex justify-between items-center">
                    <span className="tracking-widest uppercase text-xs font-black">
                      {">"} PLINKO_EXTREME_LIVE
                    </span>
                  </div>
                  <RetroPlinkoGame />
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Dice Game */}
          <div className="bg-zinc-900 border-4 border-cyan-400 shadow-[6px_6px_0px_0px_rgba(34,211,238,0.4)] p-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-cyan-400 border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center">
                <span className="text-3xl">🎲</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-black text-cyan-400 tracking-wide">
                    DICE ROLL
                  </h3>
                  <div className="bg-green-500 border-2 border-black px-2 py-1 text-white">
                    <span className="text-xs font-black tracking-tighter">
                      98X WIN
                    </span>
                  </div>
                </div>
                <p className="text-xs font-black text-gray-400 uppercase mb-2">
                  High Precision Probability
                </p>
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <button className="w-full h-12 bg-cyan-500 border-2 border-black shadow-[4px_4px_0px_0px_#000] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all font-black text-white text-lg tracking-widest">
                  ▶ ROLL THE DICE ◀
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-[100vw] max-h-[100vh] w-full h-full bg-black border-4 border-yellow-400 p-0 m-0 overflow-hidden">
                <div className="h-full overflow-y-auto bg-black text-white">
                  <div className="p-4 bg-yellow-400 text-black font-black flex justify-between items-center">
                    <span>DICE LIVE</span>
                  </div>
                  <RetroDiceGame />
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Mines Game */}
          <div className="bg-zinc-900 border-4 border-green-500 shadow-[6px_6px_0px_0px_rgba(34,197,94,0.4)] p-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-green-500 border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center">
                <span className="text-3xl">💎</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-black text-green-500 tracking-wide">
                    MINES
                  </h3>
                  <div className="bg-red-500 border-2 border-black px-2 py-1 text-white">
                    <span className="text-xs font-black tracking-tighter">
                      DANGER!
                    </span>
                  </div>
                </div>
                <p className="text-xs font-black text-gray-400 uppercase mb-2">
                  Avoid Bombs, Find Gems
                </p>
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <button className="w-full h-12 bg-green-600 border-2 border-black shadow-[4px_4px_0px_0px_#000] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all font-black text-white text-lg tracking-widest">
                  ▶ ENTER MINES ◀
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-[100vw] max-h-[100vh] w-full h-full bg-black border-4 border-yellow-400 p-0 m-0 overflow-hidden">
                <div className="h-full overflow-y-auto bg-black text-white">
                  <div className="p-4 bg-yellow-400 text-black font-black flex justify-between items-center">
                    <span>MINES LIVE</span>
                  </div>
                  <RetroMinesGame />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </section>

        {/* Action Sections (Same logic as old) */}
        <div className="grid gap-4">
          <div className="bg-zinc-900 border-2 border-yellow-400 p-4 shadow-[4px_4px_0_#000]">
            <h4 className="text-sm font-black text-yellow-400 mb-4 tracking-tighter uppercase underline decoration-red-500 underline-offset-4">
              Connect Socials
            </h4>
            <FarcasterActions />
          </div>
          <div className="bg-zinc-900 border-2 border-yellow-400 p-4 shadow-[4px_4px_0_#000]">
            <h4 className="text-sm font-black text-yellow-400 mb-4 tracking-tighter uppercase underline decoration-red-500 underline-offset-4">
              Wallet & Payouts
            </h4>
            <WalletActions />
          </div>
        </div>

        {/* Warning Banner */}
        <div className="bg-red-600 border-4 border-black p-4 text-center">
          <p className="text-xs font-black text-white uppercase tracking-tighter">
            ⚠️ Play Responsibly • Only bet what you can lose • House always wins
            ⚠️
          </p>
        </div>
      </main>

      {/* Retro Footer */}
      <footer className="border-t-4 border-yellow-400 bg-black py-8 text-center mt-12">
        <div className="bg-yellow-400 text-black px-6 py-2 inline-block border-2 border-red-600 font-black tracking-tighter">
          MONADCADE • 2025
        </div>
      </footer>
    </div>
  );
}
