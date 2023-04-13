import { Address } from "wagmi"

import { VaultType } from "@/lib/types"
import { useApiConcentratorVault } from "@/hooks/lib/api/useApiConcentratorVault"
import { useFallbackRead } from "@/hooks/lib/useFallbackRequest"
import { useRegistryContract } from "@/hooks/lib/useRegistryContract"

export function useConcentratorVault({
  concentratorTargetAsset,
  vaultAssetAddress,
  vaultType,
}: {
  concentratorTargetAsset?: Address
  vaultAssetAddress?: Address
  vaultType?: VaultType
}) {
  const apiQuery = useApiConcentratorVault({
    concentratorTargetAsset,
    vaultAssetAddress,
  })

  // Fallback: contract requests
  const fallbackRequest = useFallbackRead(
    {
      ...useRegistryContract(),
      functionName: "getConcentrator",
      enabled: apiQuery.isError,
      args: [
        vaultType === "curve",
        concentratorTargetAsset ?? "0x",
        vaultAssetAddress ?? "0x",
      ],
      select: (data) => ({
        ybTokenAddress: data,
        rewardTokenAddress: vaultAssetAddress ?? "0x",
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
