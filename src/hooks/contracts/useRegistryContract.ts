import { useMemo } from "react"
import { Address } from "wagmi"

import useActiveChainId from "@/hooks/useActiveChainId"

import { YieldOptimizersRegistry } from "@/constant/abi"

const REGISTRY_ADDRESS: Record<number, Address> = {
  // arbitrum
  42161: "0x425A22a10C04c7fCaCb0FD8Dfe2094bd43cb5874",
  // mainnet fork
  31337: "0x425A22a10C04c7fCaCb0FD8Dfe2094bd43cb5874",
  // arbitrum fork
  313371: "0x425A22a10C04c7fCaCb0FD8Dfe2094bd43cb5874",
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
