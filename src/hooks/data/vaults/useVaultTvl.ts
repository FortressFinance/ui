import { VaultProps } from "@/lib/types"
import { useApiVaultDynamic } from "@/hooks/api"

// TODO: Support Concentrator vaults

type UseVaultTvlParams = VaultProps & {
  poolId: number | undefined
}

export function useVaultTvl({
  asset: _address,
  poolId,
  type,
}: UseVaultTvlParams) {
  // Preferred: API request
  const apiQuery = useApiVaultDynamic({ poolId, type })
  // TODO: Fallbacks?
  return {
    ...apiQuery,
    data: apiQuery.data?.TVL,
  }
}
