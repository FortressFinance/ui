import { VaultProps } from "@/lib/types"
import useConcentratorVaultTvlFallback from "@/hooks/lib/tvl/concentrator/useConcentratorVaultTvlFallback"

export function useConcentratorVaultTvl({
  asset: primaryAsset,
  vaultAddress: targetAsset,
  type,
}: VaultProps) {
  return useConcentratorVaultTvlFallback({
    asset: primaryAsset,
    vaultAddress: targetAsset,
    type,
  })
}
