import { useQuery } from "@tanstack/react-query"
import { Address } from "wagmi"

import { fortressApi, handledResponse } from "@/lib/api/util"
import { queryKeys } from "@/lib/helpers"
import usePricer from "@/hooks/data/vaults/fallbacks/pricer/usePricer"

export function useGetDollarValue({
  asset,
  amount: amountStr,
}: {
  asset?: Address
  amount: string
}) {
  const amount = Number(amountStr)

  // preferred: api request
  const apiQuery = useQuery({
    ...queryKeys.tokens.priceUsd({ asset, amount }),
    queryFn: () => getUsdValue({ asset, amount }),
    enabled: !!asset,
  })

  // fallback request
  const isFallbackEnabled = apiQuery.isError
  const fallbackQuery = usePricer({ asset, enabled: isFallbackEnabled })

  return isFallbackEnabled
    ? { ...fallbackQuery, data: Number(fallbackQuery.data ?? 0) * amount }
    : { ...apiQuery, data: apiQuery.data?.usdValue }
}

type GetUsdValueResponse = {
  usdValue: number | string
}

async function getUsdValue({
  asset,
  amount,
}: {
  asset?: Address
  amount?: number
}) {
  const _amount = Number(amount)
  const resp = await fortressApi.post<GetUsdValueResponse>(
    "Protocol/get_usd_value",
    {
      amount: isNaN(_amount) ? 0 : _amount,
      token: asset,
    }
  )
  return handledResponse(resp?.data?.data)
}
