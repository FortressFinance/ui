import { Menu, Transition } from "@headlessui/react"
import { FC, Fragment } from "react"

import clsxm from "@/lib/clsxm"

import { useActiveNetwork } from "@/components/NetworkSelector/NetworkProvider"

import { mainnetFork } from "@/constant/chains"

import ArbitrumLogo from "~/svg/arbitrum_logo.svg"
import EthereumLogo from "~/svg/ethereum-logo.svg"
import ChevronDown from "~/svg/icons/chevron-down.svg"

type NetworkSelectorProps = {
  className?: string
}

const NetworkSelector: FC<NetworkSelectorProps> = ({ className }) => {
  const { chain, chains, switchActiveNetwork } = useActiveNetwork()

  return (
    <>
      {chain && (
        <div className="min-w-30 mr-3 text-right">
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="text-medium inline-flex w-full justify-center rounded-md bg-black bg-opacity-20 px-4 py-3 font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                {chain.id === mainnetFork.id ? (
                  <EthereumLogo
                    className="mr-2 h-5 w-5"
                    aria-hidden="true"
                    aria-label="Ethereum"
                  />
                ) : (
                  <ArbitrumLogo
                    className="mr-2 h-5 w-5"
                    aria-hidden="true"
                    aria-label="Arbitrum one"
                  />
                )}
                {chain.name}
                <ChevronDown
                  className="ml-2 -mr-1 mt-1 h-4 w-4 text-violet-200 hover:text-violet-100"
                  aria-label="Switch network"
                />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-[#F0707B] text-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="px-1 py-1 ">
                  {chains
                    .filter((c) => c !== undefined)
                    .map((curChain, index) => (
                      <Menu.Item
                        key={index}
                        as={Fragment}
                        disabled={
                          !switchActiveNetwork || chain.id === curChain?.id
                        }
                      >
                        {({ active }) => (
                          <button
                            onClick={() =>
                              curChain !== undefined
                                ? switchActiveNetwork?.(curChain.id)
                                : null
                            }
                            className={clsxm(
                              "text-medium group flex w-full items-center justify-between rounded-md px-2 py-2",
                              {
                                "bg-black/10": active,
                              }
                            )}
                          >
                            <div>
                              {curChain?.id === mainnetFork.id ? (
                                <EthereumLogo
                                  className="float-left mr-2 h-5 w-5"
                                  aria-hidden="true"
                                  aria-label="Ethereum"
                                />
                              ) : (
                                <ArbitrumLogo
                                  className="float-left mr-2 h-5 w-5"
                                  aria-hidden="true"
                                  aria-label="Arbitrum one"
                                />
                              )}
                              <span>{curChain?.name}</span>
                            </div>
                            <div>
                              {chain.id === curChain?.id && (
                                <div className="flex h-5 w-5 justify-center py-1 align-middle">
                                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                </div>
                              )}
                            </div>
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      )}
    </>
  )
}

export default NetworkSelector
