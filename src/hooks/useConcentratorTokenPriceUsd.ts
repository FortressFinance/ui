import { useQuery } from "@tanstack/react-query"
import { Address } from "wagmi"

import { getGlpPrice } from "@/lib/api/pricer/getGlpPrice"
import { getLlamaPrice } from "@/lib/api/pricer/getLlamaPrice"
import { queryKeys } from "@/lib/helpers"
import { useActiveChainId, useIsConcentratorTokenVault } from "@/hooks"

export function useConcentratorTokenPriceUsd({
  asset = "0x",
  enabled,
}: {
  asset?: Address
  enabled?: boolean
}) {
  const isToken = useIsConcentratorTokenVault(asset)
  const chainId = useActiveChainId()

  const priceTokenRequest = useQuery({
    ...queryKeys.tokens.priceUsd({ asset }),
    queryFn: () => getGlpPrice(),
    enabled: enabled && asset !== "0x" && isToken,
  })

  const priceCurveRequest = useQuery({
    ...queryKeys.tokens.priceUsd({ asset }),
    queryFn: () => getLlamaPrice({ asset, chainId }),
    enabled: enabled && asset !== "0x" && !isToken,
  })

  if (asset === "0x") {
    return {
      isLoading: false,
      data: 0,
    }
  }
  if (isToken) {
    return priceTokenRequest
  }
  return priceCurveRequest
}
