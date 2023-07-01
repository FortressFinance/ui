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
import { WalletConnectConnector } from "wagmi/connectors/walletConnect"

import { enabledNetworks } from "@/lib/wagmi"

import { TooltipProvider } from "@/components/Tooltip"

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
    new WalletConnectConnector({
      chains,
      options: {
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "",
        showQrModal: true,
        metadata: {
          name: "Fortress Finance",
          description:
            "composable financial products for passive DeFi investors",
          url: "https://app.fortress.finance",
          icons: [
            "https://fortress.finance/favicon/android-chrome-512x512.png",
          ],
        },
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
    <TooltipProvider>
      <ToastProvider>
        <QueryClientProvider client={queryClient}>
          <WagmiConfig config={config}>{children}</WagmiConfig>
        </QueryClientProvider>
      </ToastProvider>
    </TooltipProvider>
  )
}

export default AppProviders

export { chains }
