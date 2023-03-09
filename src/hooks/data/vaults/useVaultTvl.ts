import { VaultProps } from "@/lib/types"
import { useApiVaultDynamic } from "@/hooks/api"
import useCurveVaultTvl from "@/hooks/data/vaults/fallbacks/tvl/useCurveVaultTvl"
import { useIsCurveCompounder, useIsTokenCompounder } from "@/hooks/useVaultTypes"

// TODO: Support Concentrator vaults

type UseVaultTvlParams = VaultProps & {
  poolId: number | undefined
}

export function useVaultTvl({
  asset: _address,
  vaultAddress,
  poolId,
  type,
}: UseVaultTvlParams) {
  const isCurve = useIsCurveCompounder(type)
  const isToken = useIsTokenCompounder(type)
  // Preferred: API request
  const apiQuery = useApiVaultDynamic({ poolId, type })
  
  const isCurveFallbackEnabled = apiQuery.isError && isCurve && !isToken
  const isBalancerFallbackEnabled = apiQuery.isError && !isCurve && !isToken
  const isTokenFallbackEnabled = apiQuery.isError && isToken

  const curveVaultTotalApr = useCurveVaultTvl({
    asset: _address,
    vaultAddress,
    enabled: isCurveFallbackEnabled ?? false,
  })

  if(isCurveFallbackEnabled) {
    return curveVaultTotalApr
  }

  return {
    ...apiQuery,
    data: apiQuery.data?.TVL,
  }
}
