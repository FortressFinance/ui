import { Address, useContractRead } from "wagmi"

import { useApiConcentratorUnderlyingAssets } from "@/hooks/lib/api/useApiConcentratorUnderlyingAssets"
import { useRegistryContract } from "@/hooks/lib/useRegistryContract"
import { useConcentratorFirstVaultType } from "@/hooks/useConcentratorFirstVaultType"

export function useConcentratorUnderlyingAssets({
  targetAsset,
  primaryAsset,
}: {
  targetAsset: Address
  primaryAsset: Address
}) {
  const apiQuery = useApiConcentratorUnderlyingAssets({
    targetAsset,
    primaryAsset,
    enabled: true,
  })
  const firstConcentratorVaultType = useConcentratorFirstVaultType({
    targetAsset,
  })
  const underlyingAssets = useContractRead({
    ...useRegistryContract(),
    functionName: "getConcentratorUnderlyingAssets",
    args: [firstConcentratorVaultType === "curve", targetAsset, primaryAsset],
    enabled: apiQuery.isError,
  })
  return apiQuery.isError ? underlyingAssets : apiQuery
}
