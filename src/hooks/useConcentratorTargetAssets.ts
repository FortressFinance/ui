import { ethers } from "ethers"
import { Address } from "wagmi"

import { useApiConcentratorTargetAssets } from "@/hooks/lib/api/useApiConcentratorTargetAssets"
import { useFallbackRead } from "@/hooks/lib/useFallbackRequest"
import { useRegistryContract } from "@/hooks/lib/useRegistryContract"

///
/// Returns the concentrator lists
///
export function useConcentratorTargetAssets(
  options: {
    onSuccess?: (data: Address[]) => void
  } = {}
) {
  const apiQuery = useApiConcentratorTargetAssets(options)

  const targetAssets = useFallbackRead(
    {
      ...useRegistryContract(),
      functionName: "concentratorTargetAssets",
      select: (data) =>
        Array.from(
          new Set(data.filter((x) => x !== ethers.constants.AddressZero))
        ),
      onSuccess: options.onSuccess,
      enabled: apiQuery.isError,
    },
    []
  )

  if (apiQuery.isError) {
    return {
      ...targetAssets,
      data: targetAssets.data,
    }
  }

  return apiQuery
}
