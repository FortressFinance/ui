import { useApiCompounderPoolDynamic } from "@/hooks/api"
import { VaultDynamicProps } from "@/hooks/types"

export default function useVaultDepositedTokens({
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
