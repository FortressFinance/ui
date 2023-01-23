import { ChainProviderFn } from "@wagmi/core"
import { Chain } from "wagmi"
import { jsonRpcProvider } from "wagmi/providers/jsonRpc"

export const mainnetFork: Chain = {
  id: 31_337,
  name: "Mainnet Fork",
  network: "mainnetFork",
  nativeCurrency: {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["http://18.196.63.80:8546"],
    },
  },
}

export const mainnetForkProvider = (): ChainProviderFn =>
  jsonRpcProvider({
    rpc: () => ({
      http: "http://18.196.63.80:8546",
      // webSocket: "wss://18.196.63.80:8546",
    }),
  })
