import { Inter, VT323 } from "@next/font/google"
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"
import { Analytics } from "@vercel/analytics/react"
import { AppProps } from "next/app"
import { useState } from "react"

import "@/styles/globals.css"

import WagmiProvider from "@/components/WagmiProvider"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const vt323 = VT323({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-vt323",
})

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnMount: false,
          refetchOnWindowFocus: false,
          retryOnMount: false,
        },
      },
    })
  )

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
          <Hydrate state={pageProps.dehydratedState}>
            <WagmiProvider>
              <Component {...pageProps} />
            </WagmiProvider>
          </Hydrate>
        </QueryClientProvider>
      </div>

      <Analytics />
    </>
  )
}

export default MyApp
