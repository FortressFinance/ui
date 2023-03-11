import { Address } from "wagmi"

import { useRegistryContract } from "@/hooks/contracts"
import { useFallbackRead } from "@/hooks/util"

export function useConcentratorTargetAssets(
  options: {
    onSuccess?: (data: Address[]) => void
  } = {}
) {
  const targetAssets = useFallbackRead(
    {
      ...useRegistryContract(),
      functionName: "concentratorTargetAssets",
      onSuccess: options.onSuccess,
    },
    []
  )
  return targetAssets
}
