import { Address } from "wagmi"

import { VaultType } from "@/lib/types"
import { useRegistryContract } from "@/hooks/contracts"
import { useFallbackRead } from "@/hooks/util"

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
