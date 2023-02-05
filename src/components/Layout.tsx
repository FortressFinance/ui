import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"
import { FC, PropsWithChildren } from "react"

import AppProviders from "@/components/AppProviders"
import ConnectWalletModal, {
  DisconnectWalletModal,
} from "@/components/ConnectWallet/ConnectWalletModal"
import ExternalLinks from "@/components/ExternalLinks"

import { useConnectWallet } from "@/store/connectWallet"

import FortressBackground from "~/images/fortress-background.gif"
import FortressLogo from "~/svg/fortress-logo.svg"

const ConnectWalletButton = dynamic(
  () => import("@/components/ConnectWallet/ConnectWalletButton"),
  { ssr: false }
)
const NetworkSelector = dynamic(() => import("@/components/NetworkSelector"), {
  ssr: false,
})

const Layout: FC<PropsWithChildren> = ({ children }) => {
  const [connectModal, setConnectModal] = useConnectWallet((state) => [
    state.connectModal,
    state.setConnectModal,
  ])

  return (
    <AppProviders>
      <div className="relative z-[1] grid min-h-screen grid-cols-1 grid-rows-[auto,1fr,auto]">
        <header className="sticky top-0 z-10 border-b-2 border-[rgba(255,255,255,0.025)] bg-[rgba(255,255,255,0.025)] shadow-2xl backdrop-blur-lg">
          <div className="layout flex items-center justify-between">
            <div className="flex items-center space-x-10">
              <Link className="group" href="/">
                <FortressLogo
                  className="my-6 h-8 w-auto fill-white group-hover:fill-pink-400"
                  aria-label="Fortress Finance"
                />
              </Link>

              {/* Desktop navigation */}
              <nav className="hidden space-x-10 lg:block" aria-label="Global">
                <Link className="hover:text-pink-400" href="/yield">
                  Yield
                </Link>
                <Link className="hover:text-pink-400" href="/lend">
                  Lend
                </Link>
              </nav>
            </div>

            <div className="flex items-center">
              <NetworkSelector />
              <ConnectWalletButton />
            </div>
          </div>
        </header>

        <div className="layout py-8">{children}</div>

        <footer className="layout py-6">
          <div className="grid gap-4 grid-cols-3 grid-rows-1">            
            <ExternalLinks showHelp />
            <a className="ml-3 text-xs leading-5 font-medium text-sky-600 dark:text-sky-400 bg-sky-400/10 rounded-full py-1 px-3 xl:flex items-center text-center hover:bg-sky-400/20" href="https://docs.fortress.finance/protocol/risks" target="_blank" rel="noreferrer">
              <strong className="font-semibold">This project is in beta. Use at your own risk.</strong>
            </a>
          </div>
        </footer>
      </div>

      <div className="fixed inset-0 z-0 flex h-screen w-screen items-center justify-center overflow-hidden">
        <Image
          src={FortressBackground}
          className="min-h-full min-w-full object-cover"
          priority
          alt=""
        />
      </div>

      <ConnectWalletModal
        isOpen={connectModal === "disconnected"}
        onClose={() => setConnectModal(null)}
      />
      <DisconnectWalletModal
        isOpen={connectModal === "connected"}
        onClose={() => setConnectModal(null)}
        onChange={() => setConnectModal("disconnected")}
      />
    </AppProviders>
  )
}

export default Layout
