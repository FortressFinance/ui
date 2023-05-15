import { concentratorConvertToApy } from "@/lib/api/vaults/convertToApy"
import { VaultProps } from "@/lib/types"
import useConcentratorTokenVaultTotalApy from "@/hooks/lib/apr/concentrator/useConcentratorTokenVaultTotalApy"
import useBalancerVaultTotalApy from "@/hooks/lib/apr/useBalancerVaultTotalApy"
import useCurveVaultTotalApy from "@/hooks/lib/apr/useCurveVaultTotalApy"
import { useConcentratorFallbackApr } from "@/hooks/useConcentratorApy"
import {
  useShouldUseCurveFallback,
  useShouldUseTokenFallback,
} from "@/hooks/useVaultTypes"

export function useConcentratorVaultApy({
  asset: targetAsset,
  vaultAddress: primaryAsset,
}: VaultProps) {
  const shouldCurveFallback = useShouldUseCurveFallback(primaryAsset)
  const shouldTokenFallback = useShouldUseTokenFallback(primaryAsset)

  const compounderApr = useConcentratorFallbackApr({ targetAsset })

  const isCurveFallbackEnabled = shouldCurveFallback && !shouldTokenFallback
  const isBalancerFallbackEnabled = !shouldCurveFallback && !shouldTokenFallback

  const concentratorCurveVaultTotalApy = useCurveVaultTotalApy({
    asset: primaryAsset,
    enabled: isCurveFallbackEnabled ?? false,
  })
  const concentratorBalancerVaultTotalApy = useBalancerVaultTotalApy({
    asset: primaryAsset,
    enabled: isBalancerFallbackEnabled ?? false,
  })
  const concentratorTokenVaultTotalApy = useConcentratorTokenVaultTotalApy({
    asset: primaryAsset,
    enabled: !!shouldTokenFallback,
  })

  if (primaryAsset === "0x") {
    return {
      isLoading: false,
      data: 0,
    }
  }

  if (isCurveFallbackEnabled) {
    return {
      ...concentratorCurveVaultTotalApy,
      data: concentratorConvertToApy(
        concentratorCurveVaultTotalApy.data,
        compounderApr.data
      ),
    }
  }

  if (isBalancerFallbackEnabled) {
    return {
      ...concentratorBalancerVaultTotalApy,
      data: concentratorConvertToApy(
        concentratorBalancerVaultTotalApy.data,
        compounderApr.data
      ),
    }
  }

  return {
    ...concentratorTokenVaultTotalApy,
    data: concentratorConvertToApy(
      concentratorTokenVaultTotalApy.data,
      compounderApr.data
    ),
  }
}
