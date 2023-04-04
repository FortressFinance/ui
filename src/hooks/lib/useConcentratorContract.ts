import { useMemo } from "react"
import { Address } from "wagmi"

import { useActiveChainId } from "@/hooks/useActiveChainId"

import { AMMConcentratorBase } from "@/constant/abi"

export function useConcentratorContract(address: Address) {
  const chainId = useActiveChainId()
  return useMemo(
    () => ({ chainId, abi: AMMConcentratorBase, address }),
    [address, chainId]
  )
}
