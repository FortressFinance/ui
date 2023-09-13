import { Address, useContractRead } from "wagmi"

import { useRegistryContract } from "@/hooks/lib/useRegistryContract"
import { useConcentratorFirstVaultType } from "@/hooks/useConcentratorFirstVaultType"

export function useConcentratorUnderlyingAssets({
  targetAsset,
  primaryAsset,
}: {
  targetAsset: Address
  primaryAsset: Address
}) {
  const firstConcentratorVaultType = useConcentratorFirstVaultType({
    targetAsset,
    enabled: true,
  })
  return useContractRead({
    ...useRegistryContract(),
    functionName: "getConcentratorUnderlyingAssets",
    args: [firstConcentratorVaultType === "curve", targetAsset, primaryAsset],
  })
}
