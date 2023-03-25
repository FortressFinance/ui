import { useNetwork } from "wagmi"

import { useGlobalStore } from "@/store"

export function useActiveChainId() {
  const { chain } = useNetwork()
  const fallbackChainId = useGlobalStore((store) => store.activeChainId)
  return chain?.id ?? fallbackChainId
}
