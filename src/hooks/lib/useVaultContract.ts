import { useMemo } from "react"
import { Address } from "wagmi"

import { useActiveChainId } from "@/hooks/useActiveChainId"

import { AMMCompounderBase } from "@/constant/abi/AMMCompounderBase"

export function useVaultContract(address: Address) {
  const chainId = useActiveChainId()
  return useMemo(
    () => ({ chainId, abi: AMMCompounderBase, address }),
    [address, chainId]
  )
}
