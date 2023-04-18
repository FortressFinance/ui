import { VaultProps } from "@/lib/types"
import useConcentratorVaultTvlFallback from "@/hooks/lib/tvl/concentrator/useConcentratorVaultTvlFallback"

export function useConcentratorVaultTvl({
  asset: targetAsset,
  vaultAddress: primaryAsset,
  type,
}: VaultProps) {
  return useConcentratorVaultTvlFallback({
    targetAsset,
    primaryAsset,
    type,
  })
}
