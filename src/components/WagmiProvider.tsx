import { ChainProviderFn } from "@wagmi/core"
import { FC, PropsWithChildren } from "react"
import { configureChains, createClient, WagmiConfig } from "wagmi"
import { arbitrum, Chain } from "wagmi/chains"
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet"
import { InjectedConnector } from "wagmi/connectors/injected"
import { MetaMaskConnector } from "wagmi/connectors/metaMask"
import { WalletConnectConnector } from "wagmi/connectors/walletConnect"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { infuraProvider } from "wagmi/providers/infura"
import { jsonRpcProvider } from "wagmi/providers/jsonRpc"
import { publicProvider } from "wagmi/providers/public"

const NETWORK_MAINNET_FORK = "mainnetFork"
const NETWORK_ARBITRUM_FORK = "arbitrumFork"

const MAINNET_FORK_ENABLED = Boolean(
  JSON.parse(process.env.NEXT_PUBLIC_MAINNETFORK_SUPPORTED ?? "")
)
const ARBITRUM_FORK_ENABLED = Boolean(
  JSON.parse(process.env.NEXT_PUBLIC_ARBITRUMFORK_SUPPORTED ?? "")
)
const ARBITRUM_ENABLED = Boolean(
  JSON.parse(process.env.NEXT_PUBLIC_ARBITRUM_SUPPORTED ?? "")
)

export const mainnetFork: Chain = {
  id: 31_337,
  name: "Mainnet Fork",
  network: NETWORK_MAINNET_FORK,
  nativeCurrency: {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["/api/anvil-mainnet"],
    },
  },
}

export const arbitrumFork: Chain = {
  id: 313_371,
  name: "Arbitrum Fork",
  network: NETWORK_ARBITRUM_FORK,
  nativeCurrency: {
    decimals: 18,
    name: "Wrapped Ether",
    symbol: "WETH",
  },
  rpcUrls: {
    default: {
      http: ["/api/anvil-arbitrum"],
    },
  },
}

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
    enabled: ARBITRUM_ENABLED,
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

const { chains, provider, webSocketProvider } = configureChains(
  enabledNetworks.chains,
  enabledNetworks.providers
)
const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
  connectors: [
    new MetaMaskConnector({
      chains,
      options: { shimDisconnect: true, shimChainChangedDisconnect: false },
    }),
    new InjectedConnector({ chains }),
    new WalletConnectConnector({ chains, options: { qrcode: true } }),
    new CoinbaseWalletConnector({
      chains,
      options: { appName: "Fortress Finance" },
    }),
  ],
})

const WagmiProvider: FC<PropsWithChildren> = ({ children }) => {
  return <WagmiConfig client={client}>{children}</WagmiConfig>
}

export default WagmiProvider
