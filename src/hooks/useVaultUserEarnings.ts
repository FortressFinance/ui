import { VaultProps } from "@/lib/types"
import useVaultUserEarningsFallback from "@/hooks/lib/earnings/compounder/useVaultUserEarningsFallback"

export function useVaultUserEarnings({
  asset,
  vaultAddress,
  type,
}: VaultProps) {
  return useVaultUserEarningsFallback({
    asset,
    vaultAddress,
    type,
    enabled: true,
  })

  // const apiQuery = useApiVaultDynamic({ poolId, type })
  // return {
  //   ...apiQuery,
  //   data: {
  //     earned: apiQuery.data?.userShare.earned,
  //     earnedUSD: apiQuery.data?.userShare.earnedUSD,
  //   },
  // }
}
