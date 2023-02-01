import { Inter, VT323 } from "@next/font/google"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AppProps } from "next/app"

import "@/styles/globals.css"

import WagmiProvider from "@/components/WagmiProvider"

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
          <WagmiProvider>
            <Component {...pageProps} />
          </WagmiProvider>
        </QueryClientProvider>
      </div>
    </>
  )
}

export default MyApp
