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
  expertMode: boolean
  setExpertMode: (expertMode: boolean) => void
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
      expertMode: false,
      setExpertMode: (expertMode) => set({ expertMode }),
      slippageTolerance: DEFAULT_SLIPPAGE,
      setSlippageTolerance: (slippageTolerance) => set({ slippageTolerance }),
    }),
    {
      name: "fortress-v1.global",
      partialize: (store) => ({
        // persist only the following properties
        consentAccepted: store.consentAccepted,
        expertMode: store.expertMode,
        slippageTolerance: store.slippageTolerance,
      }),
    }
  )
)
