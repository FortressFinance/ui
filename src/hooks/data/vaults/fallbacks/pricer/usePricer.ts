import { useQuery } from "@tanstack/react-query"
import { Address } from "wagmi"

import { getAladdinApiPrice } from "@/lib/api/pricer/getAladdinApiPrice"
import { getApyVisionApiPrice } from "@/lib/api/pricer/getApyVisionApiPrice"
import { getCurveFactoryCryptoPrice } from "@/lib/api/pricer/getCurveFactoryCryptoPrice"
import { getCurveFactoryPrice } from "@/lib/api/pricer/getCurveFactoryPrice"
import { getCurveLpTokenPrice } from "@/lib/api/pricer/getCurveLpTokenPrice"
import { getCurveMainPrice } from "@/lib/api/pricer/getCurveMainPrice"
import { getGlpPrice } from "@/lib/api/pricer/getGlpPrice"
import { getLlamaApiPrice } from "@/lib/api/pricer/getLlamaApiPrice"
import { getLlamaArbiApiPrice } from "@/lib/api/pricer/getLlamaArbiApiPrice"
import { getLlamaEthPrice } from "@/lib/api/pricer/getLlamaEthPrice"
import { queryKeys } from "@/lib/helpers"

import { PRIMARYASSET_PRICER } from "@/constant/mapping"

export default function usePricer({
  asset,
  enabled,
}: {
  asset?: Address
  enabled: boolean
}) {
  const source = PRIMARYASSET_PRICER[asset ?? "0x"] ?? ""

  const notSupportedSource = () => 0

  return useQuery({
    ...queryKeys.tokens.priceUsd({ asset }),
    queryFn:
      source === "LLAMA_API"
        ? () => getLlamaApiPrice(asset ?? "0x")
        : source === "LLAMA_ARBI_API"
        ? () => getLlamaArbiApiPrice(asset ?? "0x")
        : source === "ALADDIN_API"
        ? () => getAladdinApiPrice(asset ?? "0x")
        : source === "APY_VISION_API"
        ? () => getApyVisionApiPrice(asset ?? "0x")
        : source === "CURVE_FACTORY"
        ? () => getCurveFactoryPrice(asset ?? "0x")
        : source === "CURVE_FACTORY_CRYPTO"
        ? () => getCurveFactoryCryptoPrice(asset ?? "0x")
        : source === "CURVE_MAIN"
        ? () => getCurveMainPrice(asset ?? "0x")
        : source === "LLAMA_ETH"
        ? () => getLlamaEthPrice()
        : source === "GLP"
        ? () => getGlpPrice()
        : source === "CURVE_LPTOKEN"
        ? () => getCurveLpTokenPrice(asset ?? "0x")
        : notSupportedSource,
    enabled,
  })
}
