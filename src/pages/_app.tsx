import { Analytics } from "@vercel/analytics/react"
import { AppProps } from "next/app"

import "@/styles/globals.css"

import { inter, vt323 } from "@/lib/fonts"

import AppProviders from "@/components/AppProviders"

function FortressApp({ Component, pageProps }: AppProps) {
  return (
    <AppProviders>
      <div className={`${inter.variable} ${vt323.variable} font-sans`}>
        <Component {...pageProps} />
      </div>

      <Analytics />
    </AppProviders>
  )
}

export default FortressApp
