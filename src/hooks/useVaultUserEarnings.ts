import { CompounderVaultProps } from "@/lib/types"
import { useApiVaultDynamic } from "@/hooks/lib/api/useApiVaultDynamic"

type UseVaultUserEarningsParams = Pick<CompounderVaultProps, "type"> & {
  poolId?: number
}

export function useVaultUserEarnings({
  poolId,
  type,
}: UseVaultUserEarningsParams) {
  const apiQuery = useApiVaultDynamic({ poolId, type })
  return {
    ...apiQuery,
    data: {
      earned: apiQuery.data?.userShare.earned,
      earnedUSD: apiQuery.data?.userShare.earnedUSD,
    },
  }
}
