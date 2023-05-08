import { Analytics } from "@vercel/analytics/react"
import { AppProps } from "next/app"

import "@/styles/globals.css"

import { inter, vt323 } from "@/lib/fonts"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <div className={`${inter.variable} ${vt323.variable} font-sans`}>
        <Component {...pageProps} />
      </div>

      <Analytics />
    </>
  )
}

export default MyApp
