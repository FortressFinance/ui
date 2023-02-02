import { useApiVaultDynamic } from "@/hooks/api"
import { VaultProps } from "@/hooks/types"

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
