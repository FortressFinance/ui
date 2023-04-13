// TODO: Support Concentrator vaults

import { VaultProps } from "@/lib/types"
import useVaultTvlFallback from "@/hooks/lib/tvl/compounder/useVaultTvlFallback"

type UseVaultTvlParams = VaultProps & {
  poolId: number | undefined
}

export function useVaultTvl({ asset, vaultAddress }: UseVaultTvlParams) {
  return useVaultTvlFallback({
    asset,
    vaultAddress,
    enabled: true,
  })
}
