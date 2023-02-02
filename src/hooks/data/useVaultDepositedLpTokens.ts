import { useApiVaultDynamic } from "@/hooks/api"
import { VaultDynamicProps } from "@/hooks/types"

export default function useVaultDepositedLpTokens({
  asset: _address,
  poolId,
  type,
}: VaultDynamicProps) {
  // Preferred: API request
  const apiQuery = useApiVaultDynamic({ poolId, type })
  // TODO: Fallbacks?
  return {
    ...apiQuery,
    data: apiQuery.data?.poolDepositedLPtokens,
  }
}
