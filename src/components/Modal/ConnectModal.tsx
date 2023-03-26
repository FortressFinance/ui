import { Dialog } from "@headlessui/react"
import Link from "next/link"
import { FC } from "react"
import { useConnect } from "wagmi"

import { useActiveChainId } from "@/hooks"

import Button from "@/components/Button"
import ConnectorLogo from "@/components/ConnectButton/lib/ConnectorLogo"
import { ConnectModalBase } from "@/components/Modal/lib/ConnectModalBase"

import { FortIconCloseCircle } from "@/icons"

import { useGlobalStore } from "@/store"

export const ConnectModal: FC = () => {
  const [isOpen, onClose] = useGlobalStore((store) => [
    store.activeModal === "connect",
    () => store.setActiveModal(null),
  ])

  const chainId = useActiveChainId()
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect({ chainId, onSuccess: () => onClose() })

  return (
    <ConnectModalBase isOpen={isOpen} onClose={onClose}>
      <div className="grid grid-cols-[1fr,max-content] grid-rows-1 items-center">
        <Dialog.Title
          as="h1"
          className="col-span-2 col-start-1 row-start-1 text-center font-display text-3xl sm:text-4xl"
        >
          Connect Wallet
        </Dialog.Title>
        <button onClick={onClose} className="col-start-2 row-start-1">
          <FortIconCloseCircle className="h-8 w-8" />
        </button>
      </div>
      <div className="mt-6 space-y-3">
        {connectors.map((connector) => {
          if (connector.id === "injected" && connector.name === "MetaMask") {
            // do not show metamask twice
            // do not show connectors that aren't available
            return null
          }
          return (
            <Button
              key={connector.id}
              className="w-full max-sm:py-2 max-sm:text-base"
              disabled={!connector.ready}
              isLoading={isLoading && pendingConnector?.id === connector.id}
              onClick={() => connect({ connector })}
              size="large"
              variant="plain"
            >
              <div className="flex w-full items-center justify-between">
                <span>{connector.name}</span>
                <div className="flex h-10 w-10 items-center justify-center">
                  <ConnectorLogo
                    className="h-full max-h-full w-full max-w-full"
                    id={connector.id}
                    name={connector.name}
                  />
                </div>
              </div>
            </Button>
          )
        })}
      </div>

      {error && <div className="mt-6 text-center">{error.message}</div>}

      <div className="mx-auto mt-6 max-w-[20rem] text-center text-xs text-white/90">
        By connecting your wallet to Fortress finance, you acknowledge that you
        have read and understand the{" "}
        <Link
          href="https://docs.fortress.finance"
          className="font-bold underline"
          target="_blank"
        >
          Fortress Protocol documentation
        </Link>{" "}
        and acknowledge smart contract security{" "}
        <Link
          href="https://docs.fortress.finance/protocol/risks"
          className="font-bold underline"
          target="_blank"
        >
          risks
        </Link>
        .
      </div>
    </ConnectModalBase>
  )
}
