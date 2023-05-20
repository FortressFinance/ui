import { ToastProvider } from "@radix-ui/react-toast"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { noopStorage } from "@wagmi/core"
import { FC, PropsWithChildren } from "react"
import {
  configureChains,
  createConfig,
  createStorage,
  WagmiConfig,
} from "wagmi"
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet"
import { InjectedConnector } from "wagmi/connectors/injected"
import { MetaMaskConnector } from "wagmi/connectors/metaMask"
import { WalletConnectLegacyConnector } from "wagmi/connectors/walletConnectLegacy"

import { enabledNetworks } from "@/lib/wagmi"

const { chains, publicClient, webSocketPublicClient } = configureChains(
  enabledNetworks.chains,
  enabledNetworks.providers
)

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors: [
    new MetaMaskConnector({
      chains,
      options: { shimDisconnect: true },
    }),
    new InjectedConnector({ chains }),
    new WalletConnectLegacyConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new CoinbaseWalletConnector({
      chains,
      options: { appName: "Fortress Finance" },
    }),
  ],
  storage: createStorage({
    storage:
      typeof window !== "undefined" && window.localStorage
        ? window.localStorage
        : noopStorage,
    key: "fortress-v1",
  }),
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retryOnMount: false,
    },
  },
})

const AppProviders: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ToastProvider>
      <QueryClientProvider client={queryClient}>
        <WagmiConfig config={config}>{children}</WagmiConfig>
      </QueryClientProvider>
    </ToastProvider>
  )
}

export default AppProviders

export { chains }
