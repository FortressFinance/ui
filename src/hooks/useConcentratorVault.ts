import { Address } from "wagmi"

import { VaultType } from "@/lib/types"
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
  // TODO: Preferred: API request

  // Fallback: contract requests
  const fallbackRequest = useFallbackRead(
    {
      ...useRegistryContract(),
      functionName: "getConcentrator",
      args: [
        vaultType === "curve",
        concentratorTargetAsset ?? "0x",
        vaultAssetAddress ?? "0x",
      ],
      select: (data) => ({
        ybTokenAddress: data,
        rewardTokenAddress: concentratorTargetAsset ?? "0x",
      }),
    },
    []
  )

  return fallbackRequest
}
