import { useMemo } from "react"
import { Address } from "wagmi"

import { useActiveChainId } from "@/hooks"

import { YieldOptimizersRegistry } from "@/constant/abi"

const REGISTRY_ADDRESS: Record<number, Address> = {
  // arbitrum
  42161: "0x03605C3A3dAf860774448df807742c0d0e49460C",
  // mainnet fork
  31337: "0x31A65C6d4EB07ad51E7afc890aC3b7bE84dF2Ead",
  // arbitrum fork
  313371: "0x31A65C6d4EB07ad51E7afc890aC3b7bE84dF2Ead",
}

export function useRegistryContract() {
  const chainId = useActiveChainId()
  return useMemo(
    () => ({
      chainId,
      abi: YieldOptimizersRegistry,
      address: REGISTRY_ADDRESS[chainId],
    }),
    [chainId]
  )
}
