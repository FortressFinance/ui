import { Address } from "wagmi"

import { useApiConcentratorUnderlyingAssets } from "@/hooks/lib/api/useApiConcentratorUnderlyingAssets"
import { useFallbackRead } from "@/hooks/lib/useFallbackRequest"
import { useRegistryContract } from "@/hooks/lib/useRegistryContract"
import { useIsConcentratorCurveVault } from "@/hooks/useVaultTypes"

export function useConcentratorUnderlyingAssets({
  targetAsset,
  primaryAsset,
}: {
  targetAsset: Address
  primaryAsset: Address
}) {
  const apiQuery = useApiConcentratorUnderlyingAssets({ targetAsset })

  const isCurve = useIsConcentratorCurveVault(targetAsset)
  const underlyingAssets = useFallbackRead(
    {
      ...useRegistryContract(),
      functionName: "getConcentratorUnderlyingAssets",
      args: [isCurve, targetAsset, primaryAsset],
      enabled: apiQuery.isError,
    },
    []
  )

  if (apiQuery.isError) {
    return underlyingAssets
  }

  return apiQuery
}
