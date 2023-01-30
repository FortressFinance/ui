import { create } from "zustand"

type ConnectWalletModal = "connected" | "disconnected" | null

export interface ConnectWalletStore {
  connectModal: ConnectWalletModal
  setConnectModal: (_activeModal: ConnectWalletModal) => void
}

export const useConnectWallet = create<ConnectWalletStore>((set, _get) => ({
  connectModal: "connected",
  setConnectModal: (connectModal) => set({ connectModal }),
}))
