import { useFrame } from "@/components/farcaster-provider";

export function User() {
  const { context } = useFrame();

  return (
    <div className="space-y-4 border-2 border-yellow-400 bg-black p-4 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)]">
      {/* Retro Title with Green Glitch Color */}
      <h2 className="text-sm font-black text-green-400 tracking-[0.2em] uppercase mb-2">
        {">"} PLAYER_PROFILE_LOG
      </h2>

      <div className="flex flex-row space-x-6 justify-start items-center">
        {context?.user ? (
          <>
            {context?.user?.pfpUrl && (
              <div className="relative">
                <img
                  src={context?.user?.pfpUrl}
                  className="w-16 h-16 border-4 border-yellow-400 p-1 bg-black shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                  alt="User Profile"
                  width={64}
                  height={64}
                />
                {/* Status Indicator */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-black animate-pulse"></div>
              </div>
            )}

            <div className="flex flex-col justify-start items-start space-y-3">
              <p className="text-[10px] font-bold text-yellow-400/80 tracking-widest uppercase">
                Display Name:{" "}
                <span className="block text-base font-black text-white tracking-normal mt-1">
                  {context?.user?.displayName}
                </span>
              </p>

              <div className="flex gap-4">
                <p className="text-[10px] font-bold text-cyan-400 tracking-widest uppercase">
                  Username:{" "}
                  <span className="block text-xs font-black text-white bg-cyan-900/30 border border-cyan-400/50 px-2 py-1 mt-1">
                    @{context?.user?.username}
                  </span>
                </p>

                <p className="text-[10px] font-bold text-purple-400 tracking-widest uppercase">
                  FID:{" "}
                  <span className="block text-xs font-black text-white bg-purple-900/30 border border-purple-400/50 px-2 py-1 mt-1">
                    #{context?.user?.fid}
                  </span>
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3 py-4">
            <div className="w-8 h-8 border-2 border-red-500 animate-spin"></div>
            <p className="text-sm font-black text-red-500 animate-pulse tracking-widest">
              OFFLINE: NO USER CONTEXT FOUND
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
