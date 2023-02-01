import { useApiCompounderPoolDynamic } from "@/hooks/api"
import { VaultDynamicProps } from "@/hooks/types"

export default function useCompounderPoolDepositedLpTokens({
  asset: _address,
  poolId,
  type,
}: VaultDynamicProps) {
  // Preferred: API request
  const apiQuery = useApiCompounderPoolDynamic({ poolId, type })
  // TODO: Fallbacks?
  return {
    ...apiQuery,
    data: apiQuery.data?.poolDepositedLPtokens,
  }
}
