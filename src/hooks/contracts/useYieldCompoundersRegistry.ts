import { useMemo } from "react"
import { Address } from "wagmi"

import useActiveChainId from "@/hooks/useActiveChainId"

import { yieldCompoundersRegistry } from "@/constant/abi"

const YIELD_COMPOUNDERS_REGISTRY_ADDRESS: Record<number, Address> = {
  // arbitrum
  42161: "0x03605C3A3dAf860774448df807742c0d0e49460C",
  // mainnet fork
  31337: "0x03605C3A3dAf860774448df807742c0d0e49460C",
  // arbitrum fork
  313371: "0x03605C3A3dAf860774448df807742c0d0e49460C",
}

export function useYieldCompoundersRegistryContract() {
  const chainId = useActiveChainId()
  return useMemo(
    () => ({
      chainId,
      abi: yieldCompoundersRegistry,
      address: YIELD_COMPOUNDERS_REGISTRY_ADDRESS[chainId],
    }),
    [chainId]
  )
}
