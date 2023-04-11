import * as Dialog from "@radix-ui/react-dialog"
import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { FC, PropsWithChildren, useState } from "react"
import { Toaster } from "react-hot-toast"
import { useMediaQuery } from "react-responsive"

import clsxm from "@/lib/clsxm"
import { appLink } from "@/lib/helpers"
import { useClientReady } from "@/hooks"

import AppProviders from "@/components/AppProviders"
import Button from "@/components/Button"
import { ConnectButton } from "@/components/ConnectButton"
import {
  DropdownMenuButton,
  DropdownMenuItemLink,
  DropdownMenuItems,
} from "@/components/DropdownMenu"
import ExternalLinks from "@/components/ExternalLinks"
import { AccountModal, ConnectModal, ConsentModal } from "@/components/Modal"
import NetworkSelector from "@/components/NetworkSelector"
import { TxSettingsPopover } from "@/components/TxSettingsPopover"

import { FortIconClose, FortIconHamburger } from "@/icons"

import { DISABLE_CONCENTRATORS } from "@/constant/env"

import FortressLogoAnimated from "~/images/fortress-animated-logo.gif"
import FortressBackground from "~/images/fortress-background.gif"
import FortressLogo from "~/svg/fortress-logo.svg"

const Layout: FC<PropsWithChildren> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const isClientReady = useClientReady()
  const mdScreen = useMediaQuery({ query: "(max-width: 768px)" })

  return (
    <AppProviders>
      <Toaster
        containerClassName={isClientReady && mdScreen ? "" : "layout mt-[70px]"}
        position={isClientReady && mdScreen ? "bottom-center" : "top-right"}
      />
      <div className="min-h-screen-small relative z-[1] grid grid-cols-1 grid-rows-[auto,1fr]">
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
              <NavigationMenu.Root>
                <NavigationMenu.List className="hidden space-x-10 md:flex">
                  <NavigationMenu.Item>
                    <NavigationMenu.Trigger
                      // we must override these to disable showing menu on hover
                      onPointerMove={(e) => e.preventDefault()}
                      onPointerLeave={(e) => e.preventDefault()}
                      asChild
                    >
                      <DropdownMenuButton>Yield</DropdownMenuButton>
                    </NavigationMenu.Trigger>
                    <NavigationMenu.Content asChild>
                      <DropdownMenuItems>
                        <NavigationMenu.Link asChild>
                          <DropdownMenuItemLink href={appLink("/yield")}>
                            Compounders
                          </DropdownMenuItemLink>
                        </NavigationMenu.Link>
                        {DISABLE_CONCENTRATORS ? (
                          <span className="flex cursor-not-allowed items-center px-3 py-2.5">
                            <span className="opacity-50">Concentrators</span>
                            <span className="ml-1 grow-0 whitespace-nowrap rounded bg-pink-200/20 px-1 py-0.5 text-[9px] uppercase leading-tight text-pink-100/80">
                              Coming soon
                            </span>
                          </span>
                        ) : (
                          <NavigationMenu.Link asChild>
                            <DropdownMenuItemLink
                              href={appLink("/yield/concentrators")}
                            >
                              Concentrators
                            </DropdownMenuItemLink>
                          </NavigationMenu.Link>
                        )}
                      </DropdownMenuItems>
                    </NavigationMenu.Content>
                  </NavigationMenu.Item>
                  <NavigationMenu.Item asChild>
                    <span className="flex cursor-not-allowed items-center">
                      <span className="opacity-50">Lend</span>
                      <span className="ml-1 grow-0 rounded bg-pink-200/20 px-1 py-0.5 text-[9px] uppercase leading-tight text-pink-100/80">
                        Coming soon
                      </span>
                    </span>
                  </NavigationMenu.Item>
                </NavigationMenu.List>
              </NavigationMenu.Root>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              {/* Network selector for desktop */}
              <div className="max-md:hidden">
                <NetworkSelector />
              </div>

              <ConnectButton className="max-w-[12rem]" />

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
        <Dialog.Root open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-pink-900/90 backdrop-blur ui-state-closed:animate-fade-out ui-state-open:animate-fade-in" />
            <Dialog.Content className="fixed inset-y-0 right-0 z-50 ui-state-closed:animate-slide-out-right ui-state-open:animate-slide-in-right">
              <div className="relative h-full w-full max-w-xs overflow-y-auto border-l border-pink/10 bg-gradient-to-tr from-pink-600/40 to-orange-600/40 shadow-xl">
                <div className="grid h-full grid-cols-1 grid-rows-[1fr,auto] gap-16 p-3">
                  <div>
                    <div className="relative grid grid-cols-[auto,min-content,min-content] grid-rows-1 gap-x-2">
                      <NetworkSelector />

                      <TxSettingsPopover />

                      <Dialog.Close className="h-12 w-12 shrink-0 rounded bg-pink-900/40 p-3.5">
                        <FortIconClose className="h-full w-full fill-white" />
                      </Dialog.Close>
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
                            <span className="ml-1 grow-0 whitespace-nowrap rounded bg-pink-200/20 px-1 py-0.5 text-[9px] uppercase leading-tight text-pink-100/60">
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
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        <div className="layout py-4 md:py-8">{children}</div>

        <footer className="layout pb-3 pt-6 md:py-6">
          <div className="grid grid-cols-[1fr,auto,1fr] md:gap-4">
            <a
              className="col-start-2 items-center rounded-full bg-pink-900/80 px-4 py-2 text-center text-xs font-medium leading-5 text-pink-100"
              href="https://docs.fortress.finance/protocol/risks"
              target="_blank"
              rel="noreferrer"
            >
              <strong>This project is in beta. Use at your own risk.</strong>
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

      <AccountModal />
      <ConnectModal />
      <ConsentModal />
    </AppProviders>
  )
}

export default Layout
