import { Menu, Transition } from "@headlessui/react"
import { FC, Fragment } from "react"
import { useNetwork, useSwitchNetwork } from "wagmi"

import clsxm from "@/lib/clsxm"
import useActiveChainId from "@/hooks/useActiveChainId"

import { enabledNetworks, mainnetFork } from "@/components/WagmiProvider"

import { useActiveChain } from "@/store/activeChain"

import ArbitrumLogo from "~/svg/arbitrum_logo.svg"
import EthereumLogo from "~/svg/ethereum-logo.svg"
import ChevronDown from "~/svg/icons/chevron-down.svg"

type NetworkSelectorProps = {
  className?: string
}

const NetworkSelector: FC<NetworkSelectorProps> = () => {
  const { chain: connectedChain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()
  const setActiveChainId = useActiveChain((state) => state.setChainId)
  const disconnectedChainId = useActiveChainId()
  const disconnectedChain = enabledNetworks.chains.find(
    (c) => c.id === disconnectedChainId
  )
  const chain = connectedChain || { ...disconnectedChain, unsupported: false }
  const chainId = connectedChain?.id ?? disconnectedChainId

  const onClickChain = (chainId: number) => {
    if (connectedChain && switchNetwork) {
      switchNetwork(chainId)
      setActiveChainId(chainId)
    } else {
      setActiveChainId(chainId)
    }
  }

  return (
    <div className="min-w-30 mr-2 md:mr-3 text-right">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button
            className={clsxm(
              "text-medium inline-flex w-full items-center justify-center space-x-2 rounded-md border-2 bg-black/20 py-1 md:py-3 x px-2 md:px-4 text-sm md:text-base x font-medium text-white hover:bg-black/30",
              {
                "border-orange-400 text-orange-400": chain.unsupported,
                "border-transparent": !chain.unsupported,
              }
            )}
          >
            {chain.unsupported ? (
              "Unsupported Network"
            ) : (
              <>
                {chainId === mainnetFork.id ? (
                  <EthereumLogo
                    className="mr-1 md-mr-2 h-5 w-5"
                    aria-hidden="true"
                    aria-label="Ethereum"
                  />
                ) : (
                  <ArbitrumLogo
                    className="mr-1 md:mr-2 h-5 w-5"
                    aria-hidden="true"
                    aria-label="Arbitrum one"
                  />
                )}
                {chain.name}
              </>
            )}

            <ChevronDown
              className={clsxm("ml-1 md:ml-2 h-3.5 w-3.5", {
                "fill-orange-400": chain.unsupported,
                "fill-violet-200": !chain.unsupported,
              })}
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
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-orange-400 text-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1 ">
              {enabledNetworks.chains.map((curChain, index) => (
                <Menu.Item
                  key={index}
                  as={Fragment}
                  disabled={chain.id === curChain.id}
                >
                  {({ active }) => (
                    <button
                      onClick={() => onClickChain(curChain.id)}
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
                        <span>{curChain.name}</span>
                      </div>
                      <div>
                        {chain.id === curChain.id && (
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
  )
}

export default NetworkSelector
