import { useApiCompounderPoolDynamic } from "@/hooks/api"
import { VaultProps } from "@/hooks/types"

type UseVaultTvlParams = VaultProps & {
  poolId: number | undefined
}

export default function useVaultTvl({ poolId, type }: UseVaultTvlParams) {
  // Preferred: API request
  const apiQuery = useApiCompounderPoolDynamic({ poolId, type })
  // TODO: Fallbacks?
  return {
    ...apiQuery,
    data: apiQuery.data?.TVL,
  }
}
