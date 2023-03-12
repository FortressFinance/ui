import { VaultProps } from "@/lib/types"
import { useApiVaultDynamic } from "@/hooks/api"
import useVaultTvlFallback from "@/hooks/data/vaults/fallbacks/tvl/useVaultTvlFallback"

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

  const vaultTvlFallback = useVaultTvlFallback({
    asset,
    vaultAddress,
    enabled: isFallbackEnabled ?? false,
  })

  if (isFallbackEnabled) {
    return vaultTvlFallback
  }

  return {
    ...apiQuery,
    data: apiQuery.data?.TVL,
  }
}
