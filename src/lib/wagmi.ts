import { Chain, ChainProviderFn } from "wagmi"
import { arbitrum } from "wagmi/chains"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { infuraProvider } from "wagmi/providers/infura"
import { jsonRpcProvider } from "wagmi/providers/jsonRpc"
import { publicProvider } from "wagmi/providers/public"

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
    public: {
      http: ["/api/anvil-mainnet"],
    },
    default: {
      http: ["/api/anvil-mainnet"],
    },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 14353601,
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
    public: {
      http: ["/api/anvil-arbitrum"],
    },
    default: {
      http: ["/api/anvil-arbitrum"],
    },
    foundry: {
      http: ["http://18.196.63.80:8545"],
    },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 7654707,
    },
  },
}

const MAINNET_FORK_ENABLED = Boolean(
  JSON.parse(process.env.NEXT_PUBLIC_MAINNETFORK_SUPPORTED ?? "false")
)
const ARBITRUM_FORK_ENABLED = Boolean(
  JSON.parse(process.env.NEXT_PUBLIC_ARBITRUMFORK_SUPPORTED ?? "false")
)

const fortressForkProvider = ({
  priority,
}: {
  apiKey: string
  priority: number
}): ChainProviderFn =>
  jsonRpcProvider({
    rpc: (chain) => ({ http: chain.rpcUrls.default.http[0] }),
    priority,
  })

const networks = [
  {
    chain: mainnetFork,
    providers: [
      {
        id: "fortress",
        apiKey: "fortress",
        chainProviderFn: fortressForkProvider,
        priority: 1,
      },
    ],
    enabled: MAINNET_FORK_ENABLED,
  },
  {
    chain: arbitrumFork,
    providers: [
      {
        id: "fortress",
        apiKey: "fortress",
        chainProviderFn: fortressForkProvider,
        priority: 1,
      },
    ],
    enabled: ARBITRUM_FORK_ENABLED,
  },
  {
    chain: arbitrum,
    providers: [
      {
        id: "alchemy",
        apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
        chainProviderFn: alchemyProvider,
        priority: 0,
      },
      {
        id: "infura",
        apiKey: process.env.NEXT_PUBLIC_INFURA_KEY,
        chainProviderFn: infuraProvider,
        priority: 1,
      },
      {
        id: "public",
        apiKey: process.env.NEXT_PUBLIC_QUICK_KEY,
        chainProviderFn: publicProvider,
        priority: 2,
      },
    ],
    enabled: true,
  },
]

type EnabledNetworks = {
  chains: Chain[]
  providers: ChainProviderFn[]
}

const enabledProviderIds: string[] = []

export const enabledNetworks: EnabledNetworks = networks.reduce(
  (enabledNetworks, network) => {
    if (network.enabled) {
      const networkProviders = []

      for (const provider of network.providers) {
        if (!provider.apiKey || enabledProviderIds.includes(provider.id))
          continue
        networkProviders.push(
          provider.chainProviderFn({
            apiKey: provider.apiKey,
            priority: provider.priority,
          })
        )
      }

      return {
        chains: [...enabledNetworks.chains, network.chain],
        providers: [...enabledNetworks.providers, ...networkProviders],
      }
    }
    return enabledNetworks
  },
  { chains: [], providers: [] } as EnabledNetworks
)
