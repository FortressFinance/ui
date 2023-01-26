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
      http: ["/api/anvil"],
    },
  },
}

export const arbitrumFork: Chain = {
  id: 313_371,
  name: "Arbitrum Fork",
  network: "arbitrumFork",
  nativeCurrency: {
    decimals: 18,
    name: "Wrapped Ether",
    symbol: "WETH",
  },
  rpcUrls: {
    default: {
      http: ["http://18.196.63.80:8545"],
    },
  },
}

export const fortressForkProvider = (): ChainProviderFn =>
  jsonRpcProvider({
    rpc: (chain: Chain) => ({
      http:
        chain.id === 31_337
          ? "http://18.196.63.80:8546"
          : "http://18.196.63.80:8545",
    }),
  })
