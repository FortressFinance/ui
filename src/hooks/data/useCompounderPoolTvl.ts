import { useApiCompounderPoolDynamic } from "@/hooks/api"
import { VaultProps } from "@/hooks/types"

type UseCompounderPoolAprParams = VaultProps & {
  poolId: number | undefined
}

export default function useCompounderPoolTvl({
  asset: _address,
  poolId,
  type,
}: UseCompounderPoolAprParams) {
  // Preferred: API request
  const apiQuery = useApiCompounderPoolDynamic({ poolId, type })
  // TODO: Fallbacks?
  return {
    ...apiQuery,
    data: apiQuery.data?.TVL,
  }
}
