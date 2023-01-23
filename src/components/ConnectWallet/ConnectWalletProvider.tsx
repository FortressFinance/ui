import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useState,
} from "react"
import { useAccount } from "wagmi"

import {
  ConnectWalletModal,
  DisconnectWalletModal,
} from "@/components/ConnectWallet/ConnectWalletModal"

type ConnectWalletModal = "connected" | "disconnected"

type ConnectWalletContextValues = {
  activeConnectWalletModal: ConnectWalletModal | null
  showConnectWalletModal: () => void
}

export const ConnectWalletContext = createContext<ConnectWalletContextValues>({
  activeConnectWalletModal: null,
  showConnectWalletModal: () => null,
})

export const useConnectWalletContext = () => useContext(ConnectWalletContext)

const ConnectWalletProvider: FC<PropsWithChildren> = ({ children }) => {
  const { isConnected } = useAccount()
  const [activeConnectWalletModal, setActiveConnectWalletModal] =
    useState<ConnectWalletContextValues["activeConnectWalletModal"]>(null)

  const showConnectWalletModal = () =>
    setActiveConnectWalletModal(isConnected ? "connected" : "disconnected")

  return (
    <ConnectWalletContext.Provider
      value={{
        activeConnectWalletModal,
        showConnectWalletModal,
      }}
    >
      {children}

      <ConnectWalletModal
        isOpen={activeConnectWalletModal === "disconnected"}
        onClose={() => setActiveConnectWalletModal(null)}
      />
      <DisconnectWalletModal
        isOpen={activeConnectWalletModal === "connected"}
        onClose={() => setActiveConnectWalletModal(null)}
      />
    </ConnectWalletContext.Provider>
  )
}

export default ConnectWalletProvider
