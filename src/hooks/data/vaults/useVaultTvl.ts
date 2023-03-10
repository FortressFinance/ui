import { VaultProps } from "@/lib/types"
import { useApiVaultDynamic } from "@/hooks/api"
import useVaultTotalAprFallback from "@/hooks/data/vaults/fallbacks/tvl/useVaultTvlFallback"

// TODO: Support Concentrator vaults

type UseVaultTvlParams = VaultProps & {
  poolId: number | undefined
}

export function useVaultTvl({
  asset,
  vaultAddress,
  poolId,
  type,
}: UseVaultTvlParams) {
  // Preferred: API request
  const apiQuery = useApiVaultDynamic({ poolId, type })
  
  const isFallbackEnabled = apiQuery.isError

  const vaultTotalAprFallback = useVaultTotalAprFallback({
    asset,
    vaultAddress,
    enabled: isFallbackEnabled ?? false,
  })

  if(isFallbackEnabled) {
    return vaultTotalAprFallback
  }

  return {
    ...apiQuery,
    data: apiQuery.data?.TVL,
  }
}
