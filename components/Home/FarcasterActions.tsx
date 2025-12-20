import { useFrame } from "@/components/farcaster-provider";
import { APP_URL } from "@/lib/constants";

export function FarcasterActions() {
  const { actions } = useFrame();

  return (
    <div className="space-y-4 border-2 border-yellow-400 bg-black p-4 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)]">
      {/* Component Header */}
      <h2 className="text-sm font-black text-cyan-400 tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-cyan-400 animate-ping"></span>
        {">"} SOCIAL_COMMAND_CENTER
      </h2>

      <div className="flex flex-row space-x-4 justify-start items-start">
        {actions ? (
          <div className="grid grid-cols-2 gap-3 w-full">
            {/* ADD FRAME BUTTON */}
            <button
              type="button"
              className="bg-zinc-900 text-white border-2 border-white hover:bg-white hover:text-black transition-all p-2 text-[10px] font-black uppercase tracking-tighter shadow-[2px_2px_0px_#fff] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
              onClick={() => actions?.addMiniApp()}
            >
              [+] ADD TO WARPCAST
            </button>

            {/* COMPOSE CAST - THE "SHARE" BUTTON */}
            <button
              type="button"
              className="bg-purple-600 text-white border-2 border-black p-2 text-[10px] font-black uppercase tracking-tighter shadow-[2px_2px_0px_#facc15] hover:brightness-110 active:shadow-none"
              onClick={() =>
                actions?.composeCast({
                  text: "Winning big at Monadcade! 🎰 Check out this high-speed social arcade on Monad Devnet.",
                  embeds: [`${APP_URL}`],
                })
              }
            >
              📢 SHARE SCORE
            </button>

            {/* VIEW PROFILE */}
            <button
              type="button"
              className="bg-cyan-500 text-black border-2 border-black p-2 text-[10px] font-black uppercase tracking-tighter shadow-[2px_2px_0px_#fff] hover:bg-cyan-400 active:shadow-none"
              onClick={() => actions?.viewProfile({ fid: 1142672 })}
            >
              👤 VIEW TOP PLAYER
            </button>

            {/* SIGN IN */}
            <button
              type="button"
              className="bg-green-500 text-black border-2 border-black p-2 text-[10px] font-black uppercase tracking-tighter shadow-[2px_2px_0px_#fff] hover:bg-green-400 active:shadow-none"
              onClick={() =>
                actions?.signIn({ nonce: "1201", acceptAuthAddress: true })
              }
            >
              🔑 VERIFY ID
            </button>

            {/* OPEN DOCS */}
            <button
              type="button"
              className="bg-zinc-800 text-yellow-400 border-2 border-yellow-400 p-2 text-[10px] font-black uppercase tracking-tighter shadow-[2px_2px_0px_#000] hover:bg-zinc-700 active:shadow-none"
              onClick={() => actions?.openUrl("https://docs.monad.xyz")}
            >
              📖 HOW TO PLAY
            </button>

            {/* CLOSE */}
            <button
              type="button"
              className="bg-red-600 text-white border-2 border-black p-2 text-[10px] font-black uppercase tracking-tighter shadow-[2px_2px_0px_#000] hover:bg-red-500 active:shadow-none"
              onClick={() => actions?.close()}
            >
              🚪 QUIT GAME
            </button>
          </div>
        ) : (
          <div className="w-full border-2 border-dashed border-zinc-700 p-4 text-center">
            <p className="text-xs font-black text-zinc-500 animate-pulse tracking-widest uppercase">
              // NO COMMANDS AVAILABLE
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
