import { useMemo } from "react"

import { useActiveChainConfig, useActiveChainId } from "@/hooks"

import { YieldOptimizersRegistry } from "@/constant/abi"

export function useRegistryContract() {
  const chainId = useActiveChainId()
  const chainConfig = useActiveChainConfig()
  return useMemo(
    () => ({
      chainId,
      abi: YieldOptimizersRegistry,
      address: chainConfig.registryAddress,
    }),
    [chainId, chainConfig.registryAddress]
  )
}
