import { Menu, Transition } from "@headlessui/react"
import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"
import { FC, Fragment, PropsWithChildren } from "react"
import { RxHamburgerMenu } from "react-icons/rx"

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

  const menuItems = [
    {
      name: "Vaults",
      href: "/vaults",
    },
    {
      name: "Lend",
      href: "/lend",
    },
  ]

  return (
    <>
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
                {menuItems.map((item, index) => (
                  <Link
                    key={`menu-item-${index}`}
                    className="hover:text-pink-400"
                    href={item.href}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center">
              <NetworkSelector />
              <ConnectWalletButton className="px-2 md:px-5 text-sm md:text-base" />
            </div>

            {/* Mobile navigation */}
            <Menu
              as="div"
              className="relative inline-block text-left md:hidden"
            >
              <Menu.Button>
                <RxHamburgerMenu className="ml-3 h-8 w-8" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 my-3 px-3 w-56 origin-top-right divide-y divide-gray-500 bg-white text-xl text-black focus:outline-none">
                  {menuItems.map((item, index) => (
                    <Menu.Item key={`menu-item-${index}`}>
                      <Link
                        className="p-2 block text-xl leading-loose hover:text-pink-400"
                        href={item.href}
                      >
                        {item.name}
                      </Link>
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </header>

        <div className="layout py-8">{children}</div>

        <footer className="layout py-6">
          <ExternalLinks showHelp />
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
    </>
  )
}

export default Layout
