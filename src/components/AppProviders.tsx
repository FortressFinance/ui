import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { FC, PropsWithChildren } from "react"
import { configureChains, createClient, WagmiConfig } from "wagmi"
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet"
import { InjectedConnector } from "wagmi/connectors/injected"
import { MetaMaskConnector } from "wagmi/connectors/metaMask"
import { WalletConnectConnector } from "wagmi/connectors/walletConnect"

import { enabledNetworks } from "@/lib/wagmi"

const { chains, provider, webSocketProvider } = configureChains(
  enabledNetworks.chains,
  enabledNetworks.providers
)

const wagmiClient = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
  connectors: [
    new MetaMaskConnector({
      chains,
      options: { shimDisconnect: true },
    }),
    new InjectedConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: "daacd878d9425131c647eca1cd7a7e06",
        showQrModal: true,
      },
    }),
    new CoinbaseWalletConnector({
      chains,
      options: { appName: "Fortress Finance" },
    }),
  ],
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
    <QueryClientProvider client={queryClient}>
      <WagmiConfig client={wagmiClient}>{children}</WagmiConfig>
    </QueryClientProvider>
  )
}

export default AppProviders

export { chains }
