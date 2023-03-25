import { create } from "zustand"
import { persist } from "zustand/middleware"

import { enabledNetworks } from "@/lib/wagmi"

import { DEFAULT_SLIPPAGE } from "@/constant/env"

type GlobalModalName = "account" | "connect" | null

type GlobalStore = {
  activeChainId: number
  setActiveChainId: (activeChainId: number) => void
  activeModal: GlobalModalName
  setActiveModal: (activeModal: GlobalModalName) => void
  consentAccepted: boolean
  setConsentAccepted: (consentAccepted: boolean) => void
  slippageTolerance: number
  setSlippageTolerance: (slippageTolerance: number) => void
}

export const useGlobalStore = create<GlobalStore>()(
  persist(
    (set) => ({
      activeChainId: enabledNetworks.chains[0].id,
      setActiveChainId: (activeChainId) => set({ activeChainId }),
      activeModal: null,
      setActiveModal: (activeModal) => set({ activeModal }),
      consentAccepted: false,
      setConsentAccepted: (consentAccepted) => set({ consentAccepted }),
      slippageTolerance: DEFAULT_SLIPPAGE,
      setSlippageTolerance: (slippageTolerance) => set({ slippageTolerance }),
    }),
    {
      name: "fortress.store",
      partialize: (store) => ({
        // persist only the following properties
        consentAccepted: store.consentAccepted,
        slippageTolerance: store.slippageTolerance,
      }),
    }
  )
)
