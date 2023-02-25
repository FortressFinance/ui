import { Dialog, Menu, Transition } from "@headlessui/react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { FC, Fragment, PropsWithChildren, useState } from "react"

import clsxm from "@/lib/clsxm"
import { appLink } from "@/lib/helpers"

import AppProviders from "@/components/AppProviders"
import Button from "@/components/Button"
import ConnectWalletButton from "@/components/ConnectWallet/ConnectWalletButton"
import ConnectWalletModal, {
  DisconnectWalletModal,
} from "@/components/ConnectWallet/ConnectWalletModal"
import { Consent } from "@/components/Disclaimer/Consent"
import {
  DropdownMenu,
  DropdownMenuButton,
  DropdownMenuItemLink,
  DropdownMenuItems,
} from "@/components/DropdownMenu"
import ExternalLinks from "@/components/ExternalLinks"
import NetworkSelector from "@/components/NetworkSelector"
import { TxSettingsPopover } from "@/components/TxSettingsPopover"

import { FortIconClose, FortIconHamburger } from "@/icons"

import { useConnectWallet } from "@/store/connectWallet"

import { DISABLE_CONCENTRATORS } from "@/constant/env"

import FortressLogoAnimated from "~/images/fortress-animated-logo.gif"
import FortressBackground from "~/images/fortress-background.gif"
import FortressLogo from "~/svg/fortress-logo.svg"

const Layout: FC<PropsWithChildren> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [connectModal, setConnectModal] = useConnectWallet((state) => [
    state.connectModal,
    state.setConnectModal,
  ])

  const router = useRouter()

  return (
    <AppProviders>
      <div className="relative z-[1] grid min-h-[calc(100vh-5rem)] grid-cols-1 grid-rows-[auto,1fr] md:min-h-screen">
        <header className="sticky top-0 z-10 border-b border-[rgba(255,255,255,0.025)] bg-[rgba(255,255,255,0.025)] shadow-2xl backdrop-blur-lg">
          <div className="layout flex items-center justify-between">
            <div className="flex items-center space-x-10 max-sm:pl-1">
              <Link
                className="group my-3 h-11 px-1 py-2 md:my-4"
                href={appLink("/yield")}
              >
                <FortressLogo
                  className="h-full w-auto fill-white md:group-hover:hidden"
                  aria-label="Fortress Finance"
                />
                <Image
                  className="hidden h-full w-auto md:group-hover:flex"
                  priority
                  src={FortressLogoAnimated}
                  alt=""
                />
              </Link>

              {/* Desktop navigation */}
              <nav className="hidden space-x-10 md:flex" aria-label="Global">
                <Menu as={DropdownMenu}>
                  <Menu.Button as={DropdownMenuButton}>Yield</Menu.Button>
                  <Menu.Items as={DropdownMenuItems}>
                    <Menu.Item
                      as={DropdownMenuItemLink}
                      href={appLink("/yield")}
                    >
                      Compounders
                    </Menu.Item>
                    {DISABLE_CONCENTRATORS ? (
                      <Menu.Item
                        as={DropdownMenuItemLink}
                        href="#"
                        className="flex items-center"
                        disabled
                      >
                        <span className="opacity-50">Concentrators</span>
                        <span className="ml-1 grow-0 whitespace-nowrap rounded bg-pink-200/20 py-0.5 px-1 text-[9px] uppercase leading-tight text-pink-100/80">
                          Coming soon
                        </span>
                      </Menu.Item>
                    ) : (
                      <Menu.Item
                        as={DropdownMenuItemLink}
                        href={appLink("/yield/concentrators")}
                      >
                        Concentrators
                      </Menu.Item>
                    )}
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

            <div className="flex items-center gap-2 md:gap-4">
              {/* Network selector for desktop */}
              <div className="max-md:hidden">
                <NetworkSelector />
              </div>

              <ConnectWalletButton className="max-w-[12rem]" />

              {/* Hamburger menu button for mobile */}
              <Button
                className="h-12 w-12 rounded p-3 md:hidden"
                variant="outline"
                onClick={() => setSidebarOpen(true)}
              >
                <FortIconHamburger className="h-full w-full fill-current" />
              </Button>
            </div>
          </div>
        </header>

        {/* Mobile sidebar nav */}
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 md:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-200"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div
                className="fixed inset-0 z-0 bg-pink-900/90 backdrop-blur"
                aria-hidden="true"
              />
            </Transition.Child>

            <div className="fixed inset-0 flex justify-end">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-200 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-200 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="relative h-full w-full max-w-xs overflow-y-auto border-l border-pink/10 bg-gradient-to-tr from-pink-600/40 to-orange-600/40 shadow-xl backdrop-blur-xl focus:outline-none">
                  <div className="grid h-full grid-cols-1 grid-rows-[1fr,auto] gap-16 p-3">
                    <div>
                      <div className="relative grid grid-cols-[auto,min-content,min-content] grid-rows-1 gap-x-2">
                        <NetworkSelector />

                        <TxSettingsPopover />

                        <button
                          className="h-12 w-12 shrink-0 rounded bg-pink-900/40 p-3.5"
                          onClick={() => setSidebarOpen(false)}
                          type="button"
                        >
                          <FortIconClose className="h-full w-full fill-white" />
                        </button>
                      </div>

                      <nav className="mt-3">
                        <h1 className="px-3 pt-3 text-xs font-medium uppercase tracking-wider text-orange-400">
                          Yield
                        </h1>
                        <div className="space-y-2 pt-2">
                          <a
                            href={appLink("/yield")}
                            className={clsxm(
                              "block rounded px-3 py-2.5 text-lg font-medium text-white/80",
                              {
                                "bg-gradient-to-r from-orange-400/20 to-orange-400/5 text-white ring-1 ring-inset ring-orange-400/20":
                                  router.pathname === "/app/yield",
                              }
                            )}
                          >
                            Compounders
                          </a>
                          {DISABLE_CONCENTRATORS ? (
                            <span className="flex items-center gap-1 rounded px-3 py-2.5 text-lg font-medium text-white/20">
                              <span>Concentrators</span>
                              <span className="ml-1 grow-0 whitespace-nowrap rounded bg-pink-200/20 py-0.5 px-1 text-[9px] uppercase leading-tight text-pink-100/60">
                                Coming soon
                              </span>
                            </span>
                          ) : (
                            <a
                              href={appLink("/yield/concentrators")}
                              className={clsxm(
                                "block rounded px-3 py-2.5 text-lg font-medium text-white/80",
                                {
                                  "bg-gradient-to-r from-orange-400/20 to-orange-400/5 text-white ring-1 ring-inset ring-orange-400/20":
                                    router.pathname ===
                                    "/app/yield/concentrators",
                                }
                              )}
                            >
                              Concentrators
                            </a>
                          )}
                        </div>

                        <h1 className="mt-3 px-3 pt-3 text-xs font-medium uppercase tracking-wider text-orange-400/20">
                          Lend
                        </h1>
                        <div className="space-y-2 pt-2">
                          <span className="px-3 py-2.5 text-lg text-white/20">
                            Coming soon
                          </span>
                        </div>
                      </nav>
                    </div>

                    <ExternalLinks
                      className="flex-col justify-center gap-4 px-3 pb-6 text-sm text-orange-400"
                      showHelp
                      showLabels
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        <div className="layout py-4 md:py-8">{children}</div>

        <footer className="layout pt-6 pb-3 md:py-6">
          <div className="grid grid-cols-[1fr,auto,1fr] md:gap-4">
            <a
              className="col-start-2 items-center rounded-full bg-pink-900/80 px-4 py-2 text-center text-xs font-medium leading-5 text-pink-100"
              href="https://docs.fortress.finance/protocol/risks"
              target="_blank"
              rel="noreferrer"
            >
              <strong className="font-semibold">
                This project is in beta. Use at your own risk.
              </strong>
            </a>
            <div className="max-md:hidden">
              <ExternalLinks showHelp />
            </div>
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

      <Consent />
    </AppProviders>
  )
}

export default Layout
