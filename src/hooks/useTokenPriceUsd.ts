import { useQuery } from "@tanstack/react-query"
import { Address } from "wagmi"

import { getCoinGeckoPrice } from "@/lib/api/pricer/getCoinGeckoPrice"
import { getGlpPrice } from "@/lib/api/pricer/getGlpPrice"
import { getLlamaPrice } from "@/lib/api/pricer/getLlamaPrice"
import { queryKeys } from "@/lib/helpers"
import { useActiveChainId } from "@/hooks"

import { fcGlpTokenAddress, glpTokenAddress } from "@/constant/addresses"

const customPricers: Record<Address, () => Promise<number>> = {
  [glpTokenAddress]: getGlpPrice,
  [fcGlpTokenAddress]: getGlpPrice,
}

export function useTokenPriceUsd({
  asset = "0x",
  enabled,
}: {
  asset?: Address
  enabled?: boolean
}) {
  const chainId = useActiveChainId()
  const priceRequest = useQuery({
    ...queryKeys.tokens.priceUsd({ asset }),
    queryFn: customPricers[asset]
      ? customPricers[asset]
      : () => getApiPrice({ asset, chainId }),
    enabled: enabled && asset !== "0x",
  })

  if (asset === "0x") {
    return {
      isLoading: false,
      data: 0,
    }
  }
  return priceRequest
}

export async function getApiPrice({
  asset = "0x",
  chainId,
}: {
  asset?: Address
  chainId?: number
}) {
  let data = await getLlamaPrice({ asset, chainId })
  if (data === undefined) {
    data = await getCoinGeckoPrice({ asset, chainId })
  }

  return data ?? 0
}
