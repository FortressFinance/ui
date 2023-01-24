import { mainnetFork, SupportedChain } from "@/constant/chains"
import { DEFAULT_CHAIN } from "@/constant/env"
import { Menu, Transition } from "@headlessui/react"
import { FC, Fragment, SVGProps, useState } from "react"
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { arbitrum } from "wagmi/dist/chains"
import { useNetwork, useSwitchNetwork } from 'wagmi'

import EthereumLogo from "~/svg/ethereum-logo.svg"
import ArbitrumLogo from "~/svg/arbitrum_logo.svg"

import clsxm from "@/lib/clsxm"

type NetworkSelectorProps = {
  className?: string
}

const NetworkSelector: FC<NetworkSelectorProps> = ({ className }) => {
  const { chain } = useNetwork()
  const { chains, error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork()

  const changeNetwork: MouseEventHandler<HTMLButtonElement> = (e, currentChain) => {
    if(switchNetwork !== undefined && currentChain !== undefined){
      switchNetwork(currentChain.id)
    }
  }

  return (
    <>
      {chain && (
        <div className="min-w-30 text-right mr-3">
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="inline-flex w-full justify-center rounded-md bg-black bg-opacity-20 px-4 py-3 text-medium font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
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
                <ChevronDownIcon
                  className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
                  aria-hidden="true"
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
                  {chains.map((curChain, index) => (
                      <Menu.Item key={index} as={Fragment} disabled={!switchNetwork || chain.id === curChain.id}>
                        {({ active, disabled }) => (
                          <button
                            onClick={(e) => changeNetwork(e, curChain)}
                            className={clsxm("text-medium group relative flex w-full items-center rounded-md px-2 py-2", {
                              "bg-black/10": active 
                            })}
                          >
                            {curChain.id === mainnetFork.id ? (                          
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
                            {curChain.name}
                            {disabled ? (
                              <div className="relative right-[-55px] bottom-[5px]">
                                <div className="py-3 w-5 h-5 flex justify-center align-middle">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                </div>
                              </div>
                            ) : null}
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