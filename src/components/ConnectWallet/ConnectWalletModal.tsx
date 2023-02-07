import { Dialog } from "@headlessui/react"
import copy from "copy-to-clipboard"
import Link from "next/link"
import { FC, MouseEvent, PropsWithChildren, useCallback, useEffect, useState } from "react"
import { BiCopy, BiLinkExternal, BiXCircle } from "react-icons/bi"
import { useAccount, useConnect, useDisconnect, useNetwork } from "wagmi"

import clsxm from "@/lib/clsxm"
import useActiveChainId from "@/hooks/useActiveChainId"

import Address from "@/components/Address"
import Button from "@/components/Button"
import ConnectorLogo from "@/components/ConnectWallet/ConnectorLogo"
import ModalBase, { ModalBaseProps } from "@/components/Modal/ModalBase"
import OrangeModal from "@/components/Modal/OrangeModal"

export const ConnectWalletModal: FC<ModalBaseProps> = ({ isOpen, onClose }) => {
  const chainId = useActiveChainId()

  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect({
      chainId,
      onSuccess: () => onClose(),
    })

  return (
    <OrangeModal isOpen={isOpen} onClose={onClose}>
      <Dialog.Title as="h1" className="text-center font-display text-4xl">
        Connect Wallet
      </Dialog.Title>
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
              className="w-full"
              disabled={!connector.ready}
              isLoading={isLoading && pendingConnector?.id === connector.id}
              onClick={() => connect({ connector })}
              size="large"
              variant="plain"
            >
              <div className="flex w-full items-center justify-between">
                <span>{connector.name}</span>
                <div className="h-10 w-10">
                  <ConnectorLogo id={connector.id} />
                </div>
              </div>
            </Button>
          )
        })}
      </div>

      {error && <div className="mt-6 text-center">{error.message}</div>}

      <div className="mt-6 text-center font-mono text-xs">
        By connecting a wallet, you agree to XXXX Terms of Service and
        acknowledge that you have read and understand the XXXX Protocol
        Disclaimer
      </div>
    </OrangeModal>
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
  const resetAfterMs = 500

  useEffect(() => {
    if (resetAfterMs === null) return undefined

    const timeout = setTimeout(() => {
      if(isCopied){
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
      <div className="grid grid-cols-6 grid-rows-1 gap-4">
        <div></div>
        <Dialog.Title as="h1" className="text-center font-display text-4xl col-span-4">
          Account
        </Dialog.Title>
        <button onClick={onClose} className="p-2">
            <BiXCircle className="h-8 w-8" />
        </button>
      </div>

      <div className="mt-30 space-y flex flex-col divide-y">
        <div className="flex items-center justify-between py-5">
          <div>
            <div>Connected with {activeConnector?.name}</div>
          </div>

          <Button
            onClick={changeHandler}
            variant="plain"
            size="small"
            className="mr-5"
          >
            Change
          </Button>
          <Button
            onClick={disconnectHandler}
            variant="plain-negative"
            size="small"
            className="mr-0"
          >
            Disconnect
          </Button>
        </div>
        <div className="text-md flex items-center py-5 font-mono">
          <Address>{address}</Address>
        </div>
        <div className="flex items-center justify-between py-5">
          <div className={clsxm({ "text-green-400": isCopied === true })} onClick={() => staticCopy(address as string)}>
            <BiCopy              
              className="mr-2 inline h-5 w-5"
            />
            <span className="cursor-pointer">Copy address</span>
          </div>
          <Link
            href={blockExplorerUrl + "/address/" + address}
            onClick={(e) => validateExplorerLink(e, blockExplorerUrl)}
            target="_blank"
          >
            <BiLinkExternal className="mr-2 inline h-5 w-5" />
            <span>View on Explorer</span>
          </Link>
        </div>
      </div>
      <div className="w-7/8 mt-2 text-justify text-xs">
        By connecting your wallet to Fortress finance, you acknowledge that you
        have read and understand the{" "}
        <Link
          href="https://docs.fortress.finance/protocol"
          className="font-bold underline"
        >
          Fortress Protocol documentation
        </Link>{" "}
        and acknowledge smart contract security{" "}
        <Link
          href="https://docs.fortress.finance/protocol/risks"
          className="font-bold underline"
        >
          Risks.
        </Link>
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
      <Dialog.Panel className="relative mx-auto grid min-h-screen w-full grid-cols-1 grid-rows-[1fr,minmax(max-content,auto),1fr] border border-pink-400 bg-gradient-to-br from-orange-600 to-pink-600 p-4 sm:min-h-0 sm:max-w-md sm:grid-rows-1 sm:rounded-lg sm:p-7 sm:pb-10">
        {children}
      </Dialog.Panel>
    </ModalBase>
  )
}
