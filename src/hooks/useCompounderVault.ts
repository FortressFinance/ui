import { Address } from "wagmi"

import { VaultType } from "@/lib/types"
import { useFallbackRead } from "@/hooks/lib/useFallbackRequest"
import { useRegistryContract } from "@/hooks/lib/useRegistryContract"

export function useCompounderVault({
  vaultAssetAddress,
  vaultType,
}: {
  vaultAssetAddress: Address
  vaultType: VaultType
}) {
  // TODO: Preferred: API request
  // Fallback: contract requests
  const fallbackRequest = useFallbackRead(
    {
      ...useRegistryContract(),
      functionName:
        vaultType === "token"
          ? "getTokenCompounderVault"
          : "getAmmCompounderVault",
      args:
        vaultType === "token"
          ? [vaultAssetAddress]
          : [vaultType === "curve", vaultAssetAddress],
      select: (data) => ({
        ybTokenAddress: data,
      }),
    },
    []
  )

  return fallbackRequest
}
