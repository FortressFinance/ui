import { useQueries, useQuery } from "@tanstack/react-query"
import { Address } from "wagmi"

import {
  fetchApiAuraFinance,
  getAuraMint,
  getBalancerTotalAprFallback,
} from "@/lib/api/vaults"
import { useActiveChainId } from "@/hooks"

export default function useBalancerVaultMainnetTotalApr({
  asset,
  enabled,
}: {
  asset: Address
  enabled: boolean
}) {
  const balancerVaultBreakdownApr = useBalancerVaultMainnetBreakdownApr({
    asset,
    enabled,
  })

  return {
    ...balancerVaultBreakdownApr,
    data: balancerVaultBreakdownApr.data?.totalApr,
  }
}

export function useBalancerVaultMainnetBreakdownApr({
  asset,
  enabled,
}: {
  asset: Address
  enabled: boolean
}) {
  const chainId = useActiveChainId()
  const auraQuery = useQueries({
    queries: [
      {
        queryKey: [chainId, asset, "auraFinance"],
        queryFn: () => fetchApiAuraFinance(asset),
        staleTime: Infinity,
        enabled,
        keepPreviousData: enabled,
        refetchInterval: enabled ? 20000 : false,
        refetchIntervalInBackground: false,
      },
      {
        queryKey: [chainId, asset, "auraMint"],
        queryFn: () => getAuraMint(),
        staleTime: Infinity,
        enabled,
        keepPreviousData: enabled,
        refetchInterval: enabled ? 20000 : false,
        refetchIntervalInBackground: false,
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
      keepPreviousData: enabled,
      refetchInterval: enabled ? 20000 : false,
      refetchIntervalInBackground: false,
    }
  )

  return balancerTotalAprFallbackQuery
}
