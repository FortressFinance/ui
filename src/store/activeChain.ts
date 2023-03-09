import { create } from "zustand"

import { chains } from "@/components/AppProviders"

export interface ActiveChainStore {
  chainId: number
  setChainId: (_chainId: number) => void
}

export const useActiveChain = create<ActiveChainStore>((set, _get) => ({
  chainId: chains[0].id,
  setChainId: (chainId) => set({ chainId }),
}))
