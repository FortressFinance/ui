import { Dialog } from "@headlessui/react"
import copy from "copy-to-clipboard"
import Link from "next/link"
import { FC, PropsWithChildren, useCallback, useState } from "react"
import { BiCopy, BiLinkExternal, BiXCircle } from "react-icons/bi"
import { useAccount, useConnect, useDisconnect } from "wagmi"

import clsxm from "@/lib/clsxm"

import Address from "@/components/Address"
import Button from "@/components/Button"
import ConnectorLogo from "@/components/ConnectWallet/ConnectorLogo"
import ModalBase, { ModalBaseProps } from "@/components/Modal/ModalBase"
import OrangeModal from "@/components/Modal/OrangeModal"

import { CHAIN_ID } from "@/constant/env"
import { ExplorerDataType, getExplorerLink } from "@/utils/getExplorerLinks"

export const ConnectWalletModal: FC<ModalBaseProps> = ({ isOpen, onClose }) => {
  const chainId = Number(CHAIN_ID)

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

type DisconnectWalletModalProps = ModalBaseProps & { onChange: () => void; }

export const DisconnectWalletModal: FC<DisconnectWalletModalProps> = ({
  isOpen,
  onClose,
  onChange,
}) => {
  const { address, connector: activeConnector } = useAccount()
  const { disconnect } = useDisconnect()
  const chainId = Number(CHAIN_ID)
  const [isCopied, setCopied] = useState(false)

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

  return (
    <ConnectWalletModalBase isOpen={isOpen} onClose={onClose}>
      <div className="flex h-full items-start justify-end">
        <button onClick={onClose} className="p-2">
          <BiXCircle className="h-8 w-8" />
        </button>
      </div>

      <Dialog.Title as="h1" className="text-center font-display text-4xl">
        Account
      </Dialog.Title>

      <div className="flex flex-col mt-30 space-y divide-y">
        <div className="flex items-center justify-between py-5">
          <div>
            <div>Connected with {activeConnector?.name}</div>
          </div>

          <Button onClick={disconnectHandler} variant="plain" size="small" className="mr-5">
            Disconnect
          </Button>
          <Button onClick={changeHandler} variant="plain" size="small" className="mr-0">
            Change
          </Button>
        </div>
        <div className="flex items-center font-mono text-md py-5">
          <Address>{address}</Address>
        </div>
        <div className="flex items-center justify-between py-5">
          <div className={clsxm({ 'text-black': isCopied === true })}>
            <BiCopy onClick={() => staticCopy(address as string)} className="h-5 w-5 mr-2 inline" />
            <span>Copy address</span>
          </div>
          <Link href={getExplorerLink(chainId, address, ExplorerDataType.ADDRESS)} target="_blank">
            <BiLinkExternal className="h-5 w-5 mr-2 inline" />
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
      <Dialog.Panel className="relative mx-auto grid min-h-screen w-full grid-cols-1 grid-rows-[1fr,minmax(max-content,auto),1fr] border border-pink-400 bg-gradient-to-br from-orange-600 to-pink-600 p-4 sm:min-h-0 sm:max-w-md sm:grid-rows-1 sm:rounded-lg sm:p-7 sm:pb-10">
        {children}
      </Dialog.Panel>
    </ModalBase>
  )
}
