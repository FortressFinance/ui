import { useApiCompounderPoolDynamic } from "@/hooks/api/useApiCompounderPoolDynamic"
import { VaultDynamicProps } from "@/hooks/types"

export default function useCompounderPoolDepositedLpTokens({
  address: _address,
  poolId,
  type,
}: VaultDynamicProps) {
  // Preferred: API request
  const apiQuery = useApiCompounderPoolDynamic({ poolId, type })
  // TODO: Fallbacks?
  return {
    ...apiQuery,
    data: apiQuery.data?.poolDepositedLPTokens,
  }
}
