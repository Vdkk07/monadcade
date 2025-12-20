import { useFrame } from "@/components/farcaster-provider";
import { farcasterMiniApp as miniAppConnector } from "@farcaster/miniapp-wagmi-connector";
import { parseEther } from "viem";
import { monadTestnet } from "viem/chains";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSendTransaction,
  useSwitchChain,
} from "wagmi";

export function WalletActions() {
  const { isEthProviderAvailable } = useFrame();
  const { isConnected, address, chainId } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: hash, sendTransaction } = useSendTransaction();
  const { switchChain } = useSwitchChain();
  const { connect } = useConnect();

  async function sendTransactionHandler() {
    sendTransaction({
      to: "0x403ABde6929E0fA220a4B18828919f69041a511D",
      value: parseEther("1"),
    });
  }

  // Common wrapper style for all states
  const containerStyle =
    "space-y-4 border-2 border-yellow-400 bg-black p-4 shadow-[4px_4px_0px_0px_rgba(220,38,38,1)]";
  const headerStyle =
    "text-sm font-black text-green-400 tracking-[0.2em] uppercase mb-4 flex items-center gap-2";

  if (isConnected) {
    return (
      <div className={containerStyle}>
        <h2 className={headerStyle}>
          <span className="w-2 h-2 bg-green-500 animate-pulse"></span>
          {">"} WALLET_VAULT_ACTIVE
        </h2>

        <div className="flex flex-col space-y-4">
          {/* Connection Info */}
          <div className="bg-zinc-900 border border-zinc-700 p-2 space-y-2">
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
              Address Pointer:
            </p>
            <p className="text-[10px] font-mono text-yellow-400 break-all bg-black p-1 border border-zinc-800">
              {address}
            </p>
            <div className="flex justify-between items-center pt-1">
              <span className="text-[10px] text-zinc-400 font-bold uppercase">
                Network ID:
              </span>
              <span className="text-xs font-black text-white">{chainId}</span>
            </div>
          </div>

          {chainId === monadTestnet.id ? (
            <div className="space-y-3 border-t border-zinc-800 pt-4">
              <h3 className="text-xs font-black text-white uppercase tracking-wider">
                Transaction Console
              </h3>

              <button
                type="button"
                className="w-full bg-green-600 hover:bg-green-500 text-black font-black py-2 border-2 border-black shadow-[2px_2px_0px_#fff] transition-all active:shadow-none active:translate-y-1"
                onClick={sendTransactionHandler}
              >
                💸 DEPOSIT 1 $MON
              </button>

              {hash && (
                <button
                  type="button"
                  className="w-full bg-zinc-800 text-cyan-400 border border-cyan-400 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-700"
                  onClick={() =>
                    window.open(
                      `https://testnet.monadexplorer.com/tx/${hash}`,
                      "_blank"
                    )
                  }
                >
                  {">"} VIEW_ON_EXPLORER
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              className="w-full bg-red-600 text-white font-black py-3 border-2 border-black shadow-[4px_4px_0px_#facc15] hover:brightness-110"
              onClick={() => switchChain({ chainId: monadTestnet.id })}
            >
              ⚠️ SWITCH TO MONAD
            </button>
          )}

          <button
            type="button"
            className="w-full text-zinc-500 hover:text-red-500 text-[10px] font-bold uppercase tracking-[0.3em] pt-2"
            onClick={() => disconnect()}
          >
            [ DISCONNECT_SESSION ]
          </button>
        </div>
      </div>
    );
  }

  if (isEthProviderAvailable) {
    return (
      <div className={containerStyle}>
        <h2 className={headerStyle}>{">"} AUTH_REQUIRED</h2>
        <button
          type="button"
          className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-black py-4 border-4 border-black shadow-[4px_4px_0px_#dc2626] text-lg tracking-widest animate-bounce"
          onClick={() => connect({ connector: miniAppConnector() })}
        >
          INSERT WALLET
        </button>
      </div>
    );
  }

  return (
    <div className={containerStyle}>
      <h2 className={headerStyle}>{">"} SYSTEM_ERROR</h2>
      <p className="text-[10px] font-black text-red-500 bg-red-950/30 p-2 border border-red-900">
        CONNECTION ONLY AVAILABLE VIA WARPCAST CLIENT
      </p>
    </div>
  );
}
