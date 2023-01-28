import { Inter, VT323 } from "@next/font/google"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AppProps } from "next/app"
import { configureChains, createClient, WagmiConfig } from "wagmi"
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet"
import { InjectedConnector } from "wagmi/connectors/injected"
import { MetaMaskConnector } from "wagmi/connectors/metaMask"
import { WalletConnectConnector } from "wagmi/connectors/walletConnect"

import "@/styles/globals.css"

import ConnectWalletProvider from "@/components/ConnectWallet/ConnectWalletProvider"
import NetworkProvider from "@/components/NetworkSelector/NetworkProvider"

import { ENABLE_CHAINS, ENABLE_PROVIDERS } from "@/constant/env"

// wagmi configuration
const { chains, provider, webSocketProvider } = configureChains(
  ENABLE_CHAINS,
  ENABLE_PROVIDERS
)
const wagmiClient = createClient({
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

// fonts
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const vt323 = VT323({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-vt323",
})

function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        retryOnMount: false,
      },
    },
  })

  return (
    <>
      <style jsx global>{`
        :root {
          --font-inter: ${inter.style.fontFamily};
          --font-vt323: ${vt323.style.fontFamily};
        }
      `}</style>

      <div className="font-sans">
        <QueryClientProvider client={queryClient}>
          <WagmiConfig client={wagmiClient}>
            <NetworkProvider>
              <ConnectWalletProvider>
                <Component {...pageProps} />
              </ConnectWalletProvider>
            </NetworkProvider>
          </WagmiConfig>
        </QueryClientProvider>
      </div>
    </>
  )
}

export default MyApp
