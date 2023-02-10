import { VaultDynamicProps } from "@/lib/types"
import { useApiVaultDynamic } from "@/hooks/api"

export default function useVaultDepositedAssets({
  asset: _address,
  poolId,
  type,
}: VaultDynamicProps) {
  // Preferred: API request
  const apiQuery = useApiVaultDynamic({ poolId, type })
  // TODO: Fallbacks?
  return {
    ...apiQuery,
    data: apiQuery.data?.poolDepositedPrimaryAssets,
  }
}
