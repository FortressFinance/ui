import { VaultProps } from "@/lib/types"
import { useApiVaultDynamic } from "@/hooks/api"

type UseVaultTvlParams = VaultProps & {
  poolId: number | undefined
}

export default function useVaultTvl({
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
