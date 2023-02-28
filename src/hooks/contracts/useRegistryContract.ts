import { useMemo } from "react"
import { Address } from "wagmi"

import useActiveChainId from "@/hooks/useActiveChainId"

import registryAbi from "@/constant/abi/registryAbi"

const REGISTRY_ADDRESS: Record<number, Address> = {
  // arbitrum
  42161: "0x5d21d171b265e5212b3e673759c971537b6a0d01",
  // mainnet fork
  31337: "0xa7918d253764e42d60c3ce2010a34d5a1e7c1398",
  // arbitrum fork
  313371: "0x5d21d171b265e5212b3e673759c971537b6a0d01",
}

export function useRegistryContract() {
  const chainId = useActiveChainId()
  return useMemo(
    () => ({
      chainId,
      abi: registryAbi,
      address: REGISTRY_ADDRESS[chainId],
    }),
    [chainId]
  )
}
