import { Menu, Transition } from "@headlessui/react"
import { FC, Fragment } from "react"
import { useNetwork, useSwitchNetwork } from "wagmi"

import clsxm from "@/lib/clsxm"
import useActiveChainId from "@/hooks/useActiveChainId"
import { useClientReady } from "@/hooks/util"

import { chains, mainnetFork } from "@/components/AppProviders"

import { FortIconChevronDown, NetIconArbitrum, NetIconEthereum } from "@/icons"

import { useActiveChain } from "@/store/activeChain"

type NetworkSelectorProps = {
  className?: string
}

const NetworkSelector: FC<NetworkSelectorProps> = () => {
  const isReady = useClientReady()
  const { chain: connectedChain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()
  const setActiveChainId = useActiveChain((state) => state.setChainId)
  const disconnectedChainId = useActiveChainId()
  const disconnectedChain = chains.find((c) => c.id === disconnectedChainId)

  const chain = isReady
    ? connectedChain ?? { ...disconnectedChain, unsupported: false }
    : { ...chains[0], unsupported: false }

  const onClickChain = (chainId: number) => {
    if (connectedChain && switchNetwork) {
      switchNetwork(chainId)
      setActiveChainId(chainId)
    } else {
      setActiveChainId(chainId)
    }
  }

  return (
    <>
      <Menu as="div" className="flex h-full md:relative">
        <Menu.Button
          className={clsxm(
            "flex w-full items-center justify-between gap-2 rounded bg-pink-900/40 px-2 font-semibold text-white md:px-4 md:py-3 md:font-medium md:hover:bg-black/30",
            {
              "text-orange-400 ring-1 ring-inset ring-orange-400":
                chain.unsupported,
            }
          )}
        >
          <div className="flex items-center gap-3 md:gap-2">
            {chain.unsupported ? (
              "Unsupported Network"
            ) : (
              <>
                {chain.id === mainnetFork.id ? (
                  <NetIconEthereum
                    className="h-6 w-6"
                    aria-hidden="true"
                    aria-label="Ethereum"
                  />
                ) : (
                  <NetIconArbitrum
                    className="h-6 w-6"
                    aria-hidden="true"
                    aria-label="Arbitrum one"
                  />
                )}
                <span className="max-md:text-sm">{chain.name}</span>
              </>
            )}
          </div>

          <FortIconChevronDown
            className={clsxm("mr-2 w-4 md:w-3.5", {
              "stroke-orange-400": chain.unsupported,
              "stroke-white": !chain.unsupported,
            })}
            aria-label="Switch network"
          />
        </Menu.Button>

        <Transition
          as={Fragment}
          enter="transition ease-linear duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute bottom-0 left-1/2 w-56 min-w-full -translate-x-1/2 translate-y-[calc(100%+0.5rem)] rounded border border-black/60 bg-orange-400 text-white shadow-lg focus:outline-none md:rounded-md">
            <div className="space-y-1 px-1 py-1">
              {chains.map((curChain, index) => (
                <Menu.Item key={index} as={Fragment}>
                  <button
                    onClick={() => onClickChain(curChain.id)}
                    data-connected={chain.id === curChain.id}
                    className={clsxm(
                      "group flex w-full items-center gap-2 rounded-sm p-3 font-medium disabled:bg-black/10 data-[connected=true]:bg-black/10 ui-active:bg-black/30 md:rounded md:py-2"
                    )}
                  >
                    {curChain?.id === mainnetFork.id ? (
                      <NetIconEthereum
                        className="h-5 w-5 stroke-white"
                        aria-hidden="true"
                        aria-label="Ethereum"
                      />
                    ) : (
                      <NetIconArbitrum
                        className="h-5 w-5"
                        aria-hidden="true"
                        aria-label="Arbitrum one"
                      />
                    )}
                    <span>{curChain.name}</span>
                  </button>
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  )
}

export default NetworkSelector
