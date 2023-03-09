import { Address } from "wagmi"

import useAladdinApiPricer from "@/hooks/data/vaults/fallbacks/pricer/useAladdinApiPricer"
import useApyVisionApiPricer from "@/hooks/data/vaults/fallbacks/pricer/useApyVisionApiPricer"
import useCurveFactoryCryptoPricer from "@/hooks/data/vaults/fallbacks/pricer/useCurveFactoryCryptoPricer"
import useCurveFactoryPricer from "@/hooks/data/vaults/fallbacks/pricer/useCurveFactoryPricer"
import useCurveLpTokenPricer from "@/hooks/data/vaults/fallbacks/pricer/useCurveLpTokenPricer"
import useCurveMainPricer from "@/hooks/data/vaults/fallbacks/pricer/useCurveMainPricer"
import useGlpPricer from "@/hooks/data/vaults/fallbacks/pricer/useGlpPricer"
import useLlamaApiPricer from "@/hooks/data/vaults/fallbacks/pricer/useLlamaApiPricer"
import useLlamaArbiApiPricer from "@/hooks/data/vaults/fallbacks/pricer/useLlamaArbiApiPricer"
import useLlamaEthPricer from "@/hooks/data/vaults/fallbacks/pricer/useLlamaEthPricer"

import { PRIMARYASSET_PRICER } from "@/constant/mapping"

export default function usePricer({
  primaryAsset,
  enabled,
}: {
  primaryAsset: Address | undefined
  enabled: boolean
}) {
  const source = PRIMARYASSET_PRICER[primaryAsset ?? "0x"] ?? ""

  const isEnabledLlamaApi = enabled && source === "LLAMA_API"
  const isEnabledLlamaArbiApi = enabled && source === "LLAMA_ARBI_API"
  const isEnabledAladdinApi = enabled && source === "ALADDIN_API"
  const isEnabledApyVisionApi = enabled && source === "APY_VISION_API"
  const isEnabledCurveFactory = enabled && source === "CURVE_FACTORY"
  const isEnabledCurveFactoryCrypto =
    enabled && source === "CURVE_FACTORY_CRYPTO"
  const isEnabledCurveMain = enabled && source === "CURVE_MAIN"
  const isEnabledLlamaEth = enabled && source === "LLAMA_ETH"
  const isEnabledGlp = enabled && source === "GLP"
  const isEnabledCurveLpToken = enabled && source === "CURVE_LPTOKEN"

  const llamaApiQuery = useLlamaApiPricer({
    primaryAsset,
    enabled: isEnabledLlamaApi,
  })

  const llamaArbiApiQuery = useLlamaArbiApiPricer({
    primaryAsset,
    enabled: isEnabledLlamaArbiApi,
  })

  const aladdinApiQuery = useAladdinApiPricer({
    primaryAsset,
    enabled: isEnabledAladdinApi,
  })

  const apyVisionApiQuery = useApyVisionApiPricer({
    primaryAsset,
    enabled: isEnabledApyVisionApi,
  })

  const curveFactoryQuery = useCurveFactoryPricer({
    primaryAsset: primaryAsset,
    enabled: isEnabledCurveFactory,
  })

  const curveFactoryCryptoQuery = useCurveFactoryCryptoPricer({
    primaryAsset: primaryAsset,
    enabled: isEnabledCurveFactoryCrypto,
  })

  const curveMainQuery = useCurveMainPricer({
    primaryAsset: primaryAsset,
    enabled: isEnabledCurveMain,
  })

  const llamaEthQuery = useLlamaEthPricer({
    primaryAsset: primaryAsset,
    enabled: isEnabledLlamaEth,
  })

  const glpQuery = useGlpPricer({
    primaryAsset: primaryAsset,
    enabled: isEnabledGlp,
  })

  const curveLpTokenQuery = useCurveLpTokenPricer({
    primaryAsset: primaryAsset,
    enabled: isEnabledCurveLpToken,
  })

  if (isEnabledLlamaApi) {
    return llamaApiQuery
  }

  if (isEnabledLlamaArbiApi) {
    return llamaArbiApiQuery
  }

  if (isEnabledAladdinApi) {
    return aladdinApiQuery
  }

  if (isEnabledApyVisionApi) {
    return apyVisionApiQuery
  }

  if (isEnabledCurveFactory) {
    return curveFactoryQuery
  }

  if (isEnabledCurveFactoryCrypto) {
    return curveFactoryCryptoQuery
  }

  if (isEnabledCurveMain) {
    return curveMainQuery
  }

  if (isEnabledLlamaEth) {
    return llamaEthQuery
  }

  if (isEnabledGlp) {
    return glpQuery
  }

  if (isEnabledCurveLpToken) {
    return curveLpTokenQuery
  }

  return {
    isLoading: false,
    data: 0,
  }
}
