import { useQuery } from "@tanstack/react-query"
import { Address } from "wagmi"

import { fortressApi, handledResponse } from "@/lib/api/util"
import usePricer from "@/hooks/data/vaults/fallbacks/pricer/usePricer"

export function useGetDollarValue({
  asset,
  amount,
}: {
  asset: Address | undefined
  amount: number | string
}) {
  // Preferred: API request
  const apiQuery = useRequestDollarValue({ asset, amount })

  const isFallbackEnabled = apiQuery.isError

  const { data: primaryAssetPriceUsd, isLoading: isLoadingPricer } = usePricer({
    primaryAsset: asset,
    enabled: isFallbackEnabled,
  })

  const balanceUsdFallback = Number(primaryAssetPriceUsd ?? 0) * Number(amount)

  if (isFallbackEnabled) {
    return {
      isLoading: isLoadingPricer,
      data: balanceUsdFallback,
    }
  }

  return {
    ...apiQuery,
    data: apiQuery.data?.usdValue,
  }
}

function useRequestDollarValue({
  asset,
  amount,
}: {
  asset: Address | undefined
  amount: number | string
}) {
  return useQuery(["requestDollarValue", asset ?? "0x"], {
    queryFn: () => getDollarValue({ asset: asset ?? "0x", amount }),
    retry: false,
  })
}

type usdData = {
  usdValue: number | string
}

async function getDollarValue({
  asset,
  amount,
}: {
  asset: Address | undefined
  amount: number | string
}) {
  const _amount = Number(amount)
  const resp = await fortressApi.post<usdData>("protocol/get_usd_value", {
    amount: isNaN(_amount) ? 0 : _amount,
    token: asset,
  })
  return handledResponse(resp?.data?.data)
}
