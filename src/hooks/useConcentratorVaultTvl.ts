import { ConcentratorVaultProps } from "@/lib/types"
import useConcentratorVaultTvlFallback from "@/hooks/lib/tvl/concentrator/useConcentratorVaultTvlFallback"

export function useConcentratorVaultTvl({
  primaryAsset,
  targetAsset,
  type,
}: ConcentratorVaultProps) {
  return useConcentratorVaultTvlFallback({
    primaryAsset,
    targetAsset,
    type,
  })
}
