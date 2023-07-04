import { useQuery } from "@tanstack/react-query"
import { Address } from "wagmi"

import { getCurvePrice } from "@/lib/api/pricer/getCurvePrice"
import { getLlamaPrice, getLlamaPriceEth } from "@/lib/api/pricer/getLlamaPrice"
import { queryKeys } from "@/lib/helpers"
import { useActiveChainConfig, useActiveChainId } from "@/hooks"
import { useGlpPrice } from "@/hooks/lib/pricer/useGlpPrice"

import { ethTokenAddress, sGlpTokenAddress } from "@/constant/addresses"

export function useTokenPriceUsd({
  asset = "0x",
  enabled,
}: {
  asset?: Address
  enabled?: boolean
}) {
  const chainConfig = useActiveChainConfig()
  const { price } = useGlpPrice({ enabled })

  const chainId = useActiveChainId()
  const priceRequest = useQuery({
    ...queryKeys.tokens.priceUsd({ asset }),
    queryFn:
      sGlpTokenAddress === asset || chainConfig.fcGlpTokenAddress === asset
        ? () => price
        : () => getApiPrice({ asset, chainId }),
    enabled: enabled && asset !== "0x",
    keepPreviousData: enabled,
    refetchInterval: enabled ? 20000 : false,
    refetchIntervalInBackground: false,
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
  if (asset === ethTokenAddress) {
    return await getLlamaPriceEth()
  }
  let data = await getLlamaPrice({ asset, chainId })
  if (data === undefined) {
    data = await getCurvePrice({ asset, chainId })
  }
  // if(data === undefined){
  //   data = await getCoinGeckoPrice({ asset, chainId })
  // }

  return data ?? 0
}
