import { Dialog } from "@headlessui/react"
import copy from "copy-to-clipboard"
import Link from "next/link"
import {
  FC,
  MouseEvent,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react"
import { useAccount, useConnect, useDisconnect, useNetwork } from "wagmi"

import clsxm from "@/lib/clsxm"
import useActiveChainId from "@/hooks/useActiveChainId"

import Address from "@/components/Address"
import Button from "@/components/Button"
import ConnectorLogo from "@/components/ConnectWallet/ConnectorLogo"
import ModalBase, { ModalBaseProps } from "@/components/Modal/ModalBase"

import {
  FortIconCloseCircle,
  FortIconCopy,
  FortIconExternalLinkAlt,
} from "@/icons"

export const ConnectWalletModal: FC<ModalBaseProps> = ({ isOpen, onClose }) => {
  const chainId = useActiveChainId()

  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect({
      chainId,
      onSuccess: () => onClose(),
    })

  return (
    <ConnectWalletModalBase isOpen={isOpen} onClose={onClose}>
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
          href="https://docs.fortress.finance/protocol"
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
    </ConnectWalletModalBase>
  )
}

export default ConnectWalletModal

type DisconnectWalletModalProps = ModalBaseProps & { onChange: () => void }

export const DisconnectWalletModal: FC<DisconnectWalletModalProps> = ({
  isOpen,
  onClose,
  onChange,
}) => {
  const { address, connector: activeConnector } = useAccount()
  const { disconnect } = useDisconnect()
  const [isCopied, setCopied] = useState(false)
  const { chain } = useNetwork()
  const resetAfterMs = 1000

  useEffect(() => {
    if (resetAfterMs === null) return undefined

    const timeout = setTimeout(() => {
      if (isCopied) {
        setCopied(false)
      }
    }, resetAfterMs)

    return () => {
      clearTimeout(timeout)
    }
  }, [resetAfterMs, isCopied, setCopied])

  const blockExplorerUrl: string = chain?.blockExplorers?.default.url || ""

  const staticCopy = useCallback((text: string) => {
    const didCopy = copy(text)
    setCopied(didCopy)
  }, [])

  const disconnectHandler = () => {
    disconnect()
    onClose()
  }

  const changeHandler = () => {
    disconnect()
    onChange()
  }

  const validateExplorerLink = (
    e: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>,
    blockExplorerUrl: string
  ) => {
    if (blockExplorerUrl === "") {
      e.preventDefault()
    }
  }

  return (
    <ConnectWalletModalBase isOpen={isOpen} onClose={onClose}>
      <div className="grid grid-cols-[1fr,max-content] grid-rows-1 items-center">
        <Dialog.Title
          as="h1"
          className="col-span-2 col-start-1 row-start-1 text-center font-display text-3xl sm:text-4xl"
        >
          Account
        </Dialog.Title>
        <button onClick={onClose} className="col-start-2 row-start-1">
          <FortIconCloseCircle className="h-8 w-8" />
        </button>
      </div>

      <div className="space-y-3 divide-y divide-orange-600">
        <div className="py-5 sm:flex sm:items-center sm:justify-between">
          <div className="font-medium max-sm:mb-3 max-sm:text-center">
            <span className="sm:block">Connected with</span>
            <span className="sm:hidden">&nbsp;</span>
            <span className="sm:block">{activeConnector?.name ?? "..."}</span>
          </div>

          <div className="flex gap-3">
            <Button
              className="max-sm:w-1/2"
              onClick={changeHandler}
              variant="plain"
            >
              Change
            </Button>
            <Button
              className="max-sm:w-1/2"
              onClick={disconnectHandler}
              variant="plain-negative"
            >
              Disconnect
            </Button>
          </div>
        </div>

        <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap py-2 pt-4 text-xl font-medium max-sm:text-center sm:text-2xl">
          <Address>{address}</Address>
        </div>
        <div className="flex items-center justify-between pt-5 text-sm">
          <div
            className={clsxm(
              "flex cursor-pointer items-center transition-colors duration-100",
              {
                "text-white/50": isCopied === true,
              }
            )}
            onClick={() => staticCopy(address as string)}
          >
            <FortIconCopy className="mr-2 inline h-5 w-5 stroke-current" />
            <span>Copy address</span>
          </div>
          <Link
            href={blockExplorerUrl + "/address/" + address}
            className="flex items-center"
            onClick={(e) => validateExplorerLink(e, blockExplorerUrl)}
            target="_blank"
          >
            <FortIconExternalLinkAlt className="mr-2 inline h-4 w-4" />
            <span>View on Explorer</span>
          </Link>
        </div>
      </div>
    </ConnectWalletModalBase>
  )
}

const ConnectWalletModalBase: FC<PropsWithChildren<ModalBaseProps>> = ({
  children,
  ...modalProps
}) => {
  return (
    <ModalBase {...modalProps}>
      <Dialog.Panel className="relative mx-auto w-full max-w-md rounded border border-orange/50 bg-gradient-to-tr from-pink-600 to-orange-600 p-3 py-6 sm:p-6">
        {children}
      </Dialog.Panel>
    </ModalBase>
  )
}
