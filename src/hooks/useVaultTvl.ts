// TODO: Support Concentrator vaults

import { CompounderVaultProps } from "@/lib/types"
import useVaultTvlFallback from "@/hooks/lib/tvl/compounder/useVaultTvlFallback"

type UseVaultTvlParams = CompounderVaultProps & {
  poolId: number | undefined
}

export function useVaultTvl({ asset, vaultAddress }: UseVaultTvlParams) {
  return useVaultTvlFallback({
    asset,
    vaultAddress,
    enabled: true,
  })
}
