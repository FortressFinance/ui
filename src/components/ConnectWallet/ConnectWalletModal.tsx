import { Dialog } from "@headlessui/react"
import { FC, PropsWithChildren } from "react"
import { BiX } from "react-icons/bi"
import { useAccount, useConnect, useDisconnect } from "wagmi"

import Address from "@/components/Address"
import Button from "@/components/Button"
import ConnectorLogo from "@/components/ConnectWallet/ConnectorLogo"
import ModalBase, { ModalBaseProps } from "@/components/Modal/ModalBase"
import OrangeModal from "@/components/Modal/OrangeModal"

import { CHAIN_ID } from "@/constant/env"

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

export const DisconnectWalletModal: FC<ModalBaseProps> = ({
  isOpen,
  onClose,
}) => {
  const { address, connector: activeConnector } = useAccount()
  const { disconnect } = useDisconnect()

  const disconnectHandler = () => {
    disconnect()
    onClose()
  }

  return (
    <ConnectWalletModalBase isOpen={isOpen} onClose={onClose}>
      <div className="flex h-full items-start justify-end">
        <button onClick={onClose} className="p-2">
          <BiX className="h-8 w-8" />
        </button>
      </div>

      <Dialog.Title as="h1" className="text-center font-display text-4xl">
        Account
      </Dialog.Title>

      <div className="mt-6 space-y-3 divide-y">
        <div className="flex items-center justify-between pb-1">
          <div>
            <div className="font-mono text-sm">
              <Address>{address}</Address>
            </div>
            <div>Connected to {activeConnector?.name}</div>
          </div>

          <Button onClick={disconnectHandler} variant="plain">
            Disconnect
          </Button>
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
