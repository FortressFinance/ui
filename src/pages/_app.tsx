import { Inter, VT323 } from "@next/font/google"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AppProps } from "next/app"
import { configureChains, createClient, WagmiConfig } from "wagmi"
import { arbitrum } from "wagmi/chains"
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet"
import { InjectedConnector } from "wagmi/connectors/injected"
import { MetaMaskConnector } from "wagmi/connectors/metaMask"
import { WalletConnectConnector } from "wagmi/connectors/walletConnect"
import { infuraProvider } from "wagmi/providers/infura"

import "@/styles/globals.css"

import ConnectWalletProvider from "@/components/ConnectWallet/ConnectWalletProvider"

import { mainnetFork, mainnetForkProvider } from "@/constant/chains"
import { CHAIN_ID, INFURA_KEY } from "@/constant/env"

// wagmi configuration
const isDev = CHAIN_ID === 31337
const enabledChains = isDev ? [mainnetFork] : [arbitrum]
const enabledProviders = isDev
  ? [mainnetForkProvider()]
  : [infuraProvider({ apiKey: INFURA_KEY })]
const { chains, provider, webSocketProvider } = configureChains(
  enabledChains,
  enabledProviders
)
const wagmiClient = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
  connectors: [
    new MetaMaskConnector({ chains, options: { shimDisconnect: true } }),
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
            <ConnectWalletProvider>
              <Component {...pageProps} />
            </ConnectWalletProvider>
          </WagmiConfig>
        </QueryClientProvider>
      </div>
    </>
  )
}

export default MyApp
