import { Address, useContractReads } from "wagmi"

import { VaultType } from "@/lib/types"
import { useApiConcentratorVault } from "@/hooks/lib/api/useApiConcentratorVault"
import { useFallbackRead } from "@/hooks/lib/useFallbackRequest"
import { useRegistryContract } from "@/hooks/lib/useRegistryContract"

export function useConcentratorVault({
  targetAsset,
  primaryAsset,
  type,
}: {
  targetAsset?: Address
  primaryAsset?: Address
  type?: VaultType
}) {
  const apiQuery = useApiConcentratorVault({
    targetAsset,
  })

  // Fallback: contract requests
  const fallbackRequest = useFallbackRead(
    {
      ...useRegistryContract(),
      functionName: "getConcentrator",
      enabled: apiQuery.isError,
      args: [type === "curve", targetAsset ?? "0x", primaryAsset ?? "0x"],
      select: (data) => ({
        ybTokenAddress: data,
        rewardTokenAddress: targetAsset ?? "0x",
      }),
    },
    []
  )

  if (apiQuery.isError) {
    return {
      ...fallbackRequest,
      data: fallbackRequest.data,
    }
  }

  return apiQuery
}

export function useConcentratorVaultList({
  targetAsset,
  primaryAssetList,
  type,
}: {
  targetAsset: Address
  primaryAssetList: Address[]
  type?: VaultType
}) {
  const registryContract = useRegistryContract()
  const contracts = primaryAssetList.map((primaryAsset) => ({
    ...registryContract,
    functionName: "getConcentrator",
    args: [type === "curve", targetAsset ?? "0x", primaryAsset ?? "0x"],
  }))

  return useContractReads({
    contracts,
    select: (data) =>
      data.map((ybTokenAddress) => (ybTokenAddress ?? "0x") as Address),
  })
}
