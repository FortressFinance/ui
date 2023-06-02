// TODO: Support Concentrator vaults

import { VaultProps } from "@/lib/types"
import useVaultTvlFallback from "@/hooks/lib/tvl/compounder/useVaultTvlFallback"

export function useVaultTvl({ asset, vaultAddress }: VaultProps) {
  return useVaultTvlFallback({
    asset,
    vaultAddress,
  })
}
