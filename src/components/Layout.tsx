import { Menu } from "@headlessui/react"
import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"
import { FC, PropsWithChildren } from "react"

import { appLink } from "@/lib/helpers"

import AppProviders from "@/components/AppProviders"
import ConnectWalletModal, {
  DisconnectWalletModal,
} from "@/components/ConnectWallet/ConnectWalletModal"
import {
  DropdownMenu,
  DropdownMenuButton,
  DropdownMenuItem,
  DropdownMenuItems,
} from "@/components/DropdownMenu"
import ExternalLinks from "@/components/ExternalLinks"

import { useConnectWallet } from "@/store/connectWallet"

import FortressLogoAnimated from "~/images/fortress-animated-logo.gif"
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
              <Link className="group" href={appLink("/")}>
                <FortressLogo
                  className="my-6 h-8 w-auto fill-white group-hover:hidden"
                  aria-label="Fortress Finance"
                />
                <Image
                  className="my-6 hidden h-8 w-auto group-hover:flex"
                  src={FortressLogoAnimated}
                  alt=""
                />
              </Link>

              {/* Desktop navigation */}
              <nav className="hidden space-x-10 lg:flex" aria-label="Global">
                <Menu as={DropdownMenu}>
                  <Menu.Button as={DropdownMenuButton}>Yield</Menu.Button>
                  <Menu.Items as={DropdownMenuItems}>
                    <Menu.Item as={DropdownMenuItem} href={appLink("/yield")}>
                      Vaults
                    </Menu.Item>
                    <Menu.Item
                      as={DropdownMenuItem}
                      href={appLink("/yield/concentrators")}
                    >
                      Concentrators
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
                <span className="flex cursor-not-allowed items-center">
                  <span className="opacity-50">Lend</span>
                  <span className="ml-1 grow-0 rounded bg-pink-200/20 py-0.5 px-1 text-[9px] uppercase leading-tight text-pink-100/80">
                    Coming soon
                  </span>
                </span>
              </nav>
            </div>

            <div className="flex items-center">
              <NetworkSelector />
              <ConnectWalletButton />
            </div>
          </div>
        </header>

        <div className="layout py-4 md:py-8">{children}</div>

        <footer className="layout py-6">
          <div className="grid grid-cols-1 grid-rows-2 gap-4 md:grid-cols-3 md:grid-rows-1">
            <a
              className="ml-3 items-center rounded-full bg-black/40 py-1 text-center text-xs font-medium leading-5 text-white/70 hover:bg-black/60 hover:text-white/90 md:col-start-2"
              href="https://docs.fortress.finance/protocol/risks"
              target="_blank"
              rel="noreferrer"
            >
              <strong className="font-semibold">
                This project is in beta. Use at your own risk.
              </strong>
            </a>
            <ExternalLinks showHelp />
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
