import { useQuery } from "@tanstack/react-query"
import { Address } from "wagmi"

import { getGlpPrice } from "@/lib/api/pricer/getGlpPrice"
import { getLlamaPrice } from "@/lib/api/pricer/getLlamaPrice"
import { queryKeys } from "@/lib/helpers"
import { useActiveChainId } from "@/hooks"

import { glpTokenAddress } from "@/constant/addresses"

const customPricers: Record<Address, () => Promise<number>> = {
  [glpTokenAddress]: getGlpPrice,
}

export function useTokenPriceUsd({
  asset = "0x",
  enabled,
}: {
  asset?: Address
  enabled?: boolean
}) {
  const chainId = useActiveChainId()
  return useQuery({
    ...queryKeys.tokens.priceUsd({ asset }),
    queryFn: customPricers[asset]
      ? customPricers[asset]
      : () => getLlamaPrice({ asset, chainId }),
    enabled: enabled && asset !== "0x",
  })
}
