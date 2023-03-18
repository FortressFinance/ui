// TODO: Support Concentrator vaults

import { VaultProps } from "@/lib/types"
import { useApiVaultDynamic } from "@/hooks/lib/api/useApiVaultDynamic"
import useVaultTvlFallback from "@/hooks/lib/tvl/useVaultTvlFallback"

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
