import { Analytics } from "@vercel/analytics/react"
import { AppProps } from "next/app"
import { Inter, VT323 } from "next/font/google"

import "@/styles/globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const vt323 = VT323({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-vt323",
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>{`
        :root {
          --font-inter: ${inter.style.fontFamily};
          --font-vt323: ${vt323.style.fontFamily};
        }
      `}</style>

      <div className="font-sans">
        <Component {...pageProps} />
      </div>

      <Analytics />
    </>
  )
}

export default MyApp
