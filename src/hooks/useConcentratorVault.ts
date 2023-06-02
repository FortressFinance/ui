import { Address, useContractRead, useContractReads } from "wagmi"

import { VaultType } from "@/lib/types"
import { useApiConcentratorVault } from "@/hooks/lib/api/useApiConcentratorVault"
import { useRegistryContract } from "@/hooks/lib/useRegistryContract"

type ConcentratorVaultProps = {
  targetAsset?: Address
  primaryAsset?: Address
  type?: VaultType
  enabled?: boolean
}

export function useConcentratorVault({
  targetAsset,
  primaryAsset,
  type,
  enabled = true,
}: ConcentratorVaultProps) {
  const apiQuery = useApiConcentratorVault({
    targetAsset,
    primaryAsset,
    enabled,
  })
  const fallbackRequest = useContractRead({
    ...useRegistryContract(),
    functionName: "getConcentrator",
    enabled: apiQuery.isError && enabled,
    args: [type === "curve", targetAsset ?? "0x", primaryAsset ?? "0x"],
    select: (ybTokenAddress) => ({
      ybTokenAddress,
      rewardTokenAddress: targetAsset ?? "0x",
    }),
  })
  return apiQuery.isError
    ? { ...fallbackRequest, data: fallbackRequest.data }
    : apiQuery
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
  return useContractReads({
    contracts: primaryAssetList.map((primaryAsset) => ({
      ...registryContract,
      functionName: "getConcentrator",
      args: [type === "curve", targetAsset ?? "0x", primaryAsset ?? "0x"],
    })),
    select: (ybTokenAddresses) =>
      ybTokenAddresses.map(
        (ybTokenAddress) => (ybTokenAddress.result ?? "0x") as Address
      ),
  })
}
