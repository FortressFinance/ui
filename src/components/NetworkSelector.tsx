import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { FC, Fragment } from "react"
import { useNetwork, useSwitchNetwork } from "wagmi"

import clsxm from "@/lib/clsxm"
import { enabledNetworks, mainnetFork } from "@/lib/wagmi"
import { useClientReady } from "@/hooks"

import { FortIconChevronDown, NetIconArbitrum, NetIconEthereum } from "@/icons"

import { useGlobalStore } from "@/store"

type NetworkSelectorProps = {
  className?: string
}

const NetworkSelector: FC<NetworkSelectorProps> = () => {
  const isReady = useClientReady()
  const { chain: connectedChain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()

  const activeChainId = useGlobalStore((store) => store.activeChainId)
  const setActiveChainId = useGlobalStore((store) => store.setActiveChainId)

  const fallbackChain = enabledNetworks.chains.find(
    (c) => c.id === activeChainId
  )

  const activeChain = isReady
    ? connectedChain ?? { ...fallbackChain, unsupported: false }
    : { ...enabledNetworks.chains[0], unsupported: false }

  const onClickChain = (chainId: number) => {
    if (connectedChain && switchNetwork) {
      switchNetwork(chainId)
      setActiveChainId(chainId)
    } else {
      setActiveChainId(chainId)
    }
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={clsxm(
            "flex w-full items-center justify-between gap-2 rounded bg-pink-900/40 px-2 font-semibold text-white md:px-4 md:py-3 md:font-medium md:hover:bg-black/30",
            {
              "text-orange-400 ring-1 ring-inset ring-orange-400":
                activeChain.unsupported,
            }
          )}
        >
          <div className="flex items-center gap-3 md:gap-2">
            {activeChain.unsupported ? (
              "Unsupported Network"
            ) : (
              <>
                {activeChain.id === mainnetFork.id ? (
                  <NetIconEthereum className="h-6 w-6" />
                ) : (
                  <NetIconArbitrum className="h-6 w-6" />
                )}
                <span className="max-md:text-sm">{activeChain.name}</span>
              </>
            )}
          </div>

          <FortIconChevronDown
            className={clsxm("mr-2 w-4 md:w-3.5", {
              "stroke-orange-400": activeChain.unsupported,
              "stroke-white": !activeChain.unsupported,
            })}
            aria-label="Switch network"
          />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content asChild>
        <div className="absolute bottom-0 left-1/2 w-56 min-w-full -translate-x-1/2 translate-y-[calc(100%+0.5rem)] rounded border border-black/60 bg-orange-400 text-white shadow-lg ui-state-closed:animate-fade-out ui-state-open:animate-fade-in md:rounded-md">
          <DropdownMenu.RadioGroup
            className="space-y-1 px-1 py-1"
            onValueChange={(chainIdStr) => onClickChain(Number(chainIdStr))}
          >
            {enabledNetworks.chains.map((chain) => (
              <DropdownMenu.RadioItem
                key={chain.id}
                value={String(chain.id)}
                className={clsxm(
                  "group flex w-full cursor-pointer items-center gap-2 rounded-sm p-3 font-medium hover:bg-black/30 focus:outline-none focus-visible:bg-black/30 disabled:bg-black/10 md:rounded md:py-2",
                  { "bg-black/10": chain.id === activeChain.id }
                )}
              >
                {chain?.id === mainnetFork.id ? (
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
                <span>{chain.name}</span>
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </div>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export default NetworkSelector
