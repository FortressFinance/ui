import { Analytics } from "@vercel/analytics/react"
import App, { AppContext, AppProps } from "next/app"
import { ReactNode } from "react"

import "@/styles/globals.css"

import { inter, vt323 } from "@/lib/fonts"

import AppProviders from "@/components/AppProviders"

type FortressAppProps = Pick<AppProps, "Component" | "pageProps"> & {
  isApp: boolean
}

function FortressApp({ Component, pageProps, isApp }: FortressAppProps) {
  const Providers = isApp
    ? AppProviders
    : ({ children }: { children: ReactNode }) => <>{children}</>

  return (
    <Providers>
      <div className={`${inter.variable} ${vt323.variable} font-sans`}>
        <Component {...pageProps} />
      </div>

      <Analytics />
    </Providers>
  )
}

FortressApp.getInitialProps = async (context: AppContext) => {
  const ctx = await App.getInitialProps(context)
  const path = context.ctx.asPath
  return { ...ctx, isApp: path !== "/" }
}

export default FortressApp
