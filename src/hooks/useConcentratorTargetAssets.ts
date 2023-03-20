import { Address } from "wagmi"

import { useFallbackRead } from "@/hooks/lib/useFallbackRequest"
import { useRegistryContract } from "@/hooks/lib/useRegistryContract"

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
