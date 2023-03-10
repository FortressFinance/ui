import { useQuery } from "@tanstack/react-query"
import { Address } from "wagmi"

import { getAladdinApiPrice } from "@/hooks/data/vaults/fallbacks/pricer/useAladdinApiPricer"
import { getApyVisionApiPrice } from "@/hooks/data/vaults/fallbacks/pricer/useApyVisionApiPricer"
import { getCurveFactoryCryptoPrice } from "@/hooks/data/vaults/fallbacks/pricer/useCurveFactoryCryptoPricer"
import { getCurveFactoryPrice } from "@/hooks/data/vaults/fallbacks/pricer/useCurveFactoryPricer"
import { getCurveLpTokenPrice } from "@/hooks/data/vaults/fallbacks/pricer/useCurveLpTokenPricer"
import { getCurveMainPrice } from "@/hooks/data/vaults/fallbacks/pricer/useCurveMainPricer"
import { getGlpPrice } from "@/hooks/data/vaults/fallbacks/pricer/useGlpPricer"
import { getLlamaApiPrice } from "@/hooks/data/vaults/fallbacks/pricer/useLlamaApiPricer"
import { getLlamaArbiApiPrice } from "@/hooks/data/vaults/fallbacks/pricer/useLlamaArbiApiPricer"
import { getLlamaEthPrice } from "@/hooks/data/vaults/fallbacks/pricer/useLlamaEthPricer"

import { PRIMARYASSET_PRICER } from "@/constant/mapping"

export default function usePricer({
  primaryAsset,
  enabled,
}: {
  primaryAsset: Address | undefined
  enabled: boolean
}) {
  const source = PRIMARYASSET_PRICER[primaryAsset ?? "0x"] ?? ""

  const notSupportedSource = () => 0

  return useQuery(["pricer", source, primaryAsset], {
    queryFn:
      source === "LLAMA_API"
        ? () => getLlamaApiPrice(primaryAsset ?? "0x")
        : source === "LLAMA_ARBI_API"
        ? () => getLlamaArbiApiPrice(primaryAsset ?? "0x")
        : source === "ALADDIN_API"
        ? () => getAladdinApiPrice(primaryAsset ?? "0x")
        : source === "APY_VISION_API"
        ? () => getApyVisionApiPrice(primaryAsset ?? "0x")
        : source === "CURVE_FACTORY"
        ? () => getCurveFactoryPrice(primaryAsset ?? "0x")
        : source === "CURVE_FACTORY_CRYPTO"
        ? () => getCurveFactoryCryptoPrice(primaryAsset ?? "0x")
        : source === "CURVE_MAIN"
        ? () => getCurveMainPrice(primaryAsset ?? "0x")
        : source === "LLAMA_ETH"
        ? () => getLlamaEthPrice()
        : source === "GLP"
        ? () => getGlpPrice()
        : source === "CURVE_LPTOKEN"
        ? () => getCurveLpTokenPrice(primaryAsset ?? "0x")
        : notSupportedSource,
    enabled: enabled,
  })
}
