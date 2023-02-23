import { useQueries, useQuery } from "@tanstack/react-query"

import {
  fetchApiAuraFinance,
  getAuraMint,
  getBalancerTotalAprFallback,
} from "@/lib/api/vaults"
import { VaultDynamicProps } from "@/lib/types"
import useActiveChainId from "@/hooks/useActiveChainId"

export default function useBalancerVaultGraphTotalApr({
  asset,
  enabled,
}: {
  asset: VaultDynamicProps["asset"]
  enabled: boolean
}) {
  const chainId = useActiveChainId()
  const auraQuery = useQueries({
    queries: [
      {
        queryKey: [chainId, asset, "auraFinance"],
        queryFn: () => fetchApiAuraFinance(asset),
        staleTime: Infinity,
        enabled: enabled,
      },
      {
        queryKey: [chainId, asset, "auraMint"],
        queryFn: () => getAuraMint(),
        staleTime: Infinity,
        enabled: enabled,
      },
    ],
  })

  const extraTokenAwards = auraQuery?.[0].data?.extraTokenAwards
  const swapFee = auraQuery?.[0].data?.swapFee
  const auraMint = auraQuery?.[1].data

  const balancerTotalAprFallbackQuery = useQuery(
    [chainId, asset, "balancerTotalAprFallback", extraTokenAwards, swapFee],
    {
      queryFn: () =>
        getBalancerTotalAprFallback(asset, extraTokenAwards, swapFee, auraMint),
      retry: false,
      enabled: enabled && !!swapFee && !!extraTokenAwards && !!auraMint,
    }
  )

  return {
    ...balancerTotalAprFallbackQuery,
    data: balancerTotalAprFallbackQuery.data?.totalApr,
  }
}
