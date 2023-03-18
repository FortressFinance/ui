import { Address } from "wagmi"

import { VaultType } from "@/lib/types"
import { useFallbackReads } from "@/hooks/lib/useFallbackRequest"
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
  const registryContract = useRegistryContract()
  const fallbackRequest = useFallbackReads(
    {
      contracts: [
        {
          ...registryContract,
          functionName: "getConcentrator",
          args: [
            vaultType === "curve",
            concentratorTargetAsset ?? "0x",
            vaultAssetAddress ?? "0x",
          ],
        },
        {
          ...registryContract,
          functionName: "getConcentratorTargetVault",
          args: [
            vaultType === "curve",
            concentratorTargetAsset ?? "0x",
            vaultAssetAddress ?? "0x",
          ],
        },
      ],
      enabled: !!vaultType && !!concentratorTargetAsset && !!vaultAssetAddress,
      select: (data) => ({
        ybTokenAddress: data[0],
        rewardTokenAddress: data[1],
      }),
    },
    []
  )

  return fallbackRequest
}
