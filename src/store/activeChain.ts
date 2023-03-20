import { create } from "zustand"

import { enabledNetworks } from "@/lib/wagmi"

export interface ActiveChainStore {
  chainId: number
  setChainId: (_chainId: number) => void
}

export const useActiveChain = create<ActiveChainStore>((set, _get) => ({
  chainId: enabledNetworks.chains[0].id,
  setChainId: (chainId) => set({ chainId }),
}))
