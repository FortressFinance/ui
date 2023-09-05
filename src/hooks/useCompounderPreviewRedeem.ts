import { PreviewTransactionBaseArgs } from "@/hooks/lib/api/types"
import useCurvePreviewRedeemFallback from "@/hooks/lib/preview/compounder/useCurvePreviewRedeemFallback"
import useTokenPreviewRedeemFallback from "@/hooks/lib/preview/compounder/useTokenPreviewRedeemFallback"
import { useIsCurveVault, useIsTokenVault } from "@/hooks/useVaultTypes"

import { useSlippageTolerance } from "@/store"

export function useCompounderPreviewRedeem({
  enabled,
  type,
  ...rest
}: PreviewTransactionBaseArgs) {
  const isToken = useIsTokenVault(type)
  const isCurve = useIsCurveVault(type)

  const curvePreviewFallback = useCurvePreviewRedeemFallback({
    ...rest,
    type,
    // we store slippage as a fraction of 100; api expects slippage as a fraction of 1
    slippage: useSlippageTolerance() / 100,
    enabled: enabled && isCurve,
  })

  const tokenPreviewFallback = useTokenPreviewRedeemFallback({
    ...rest,
    slippage: useSlippageTolerance() / 100,
    enabled: enabled && isToken,
  })

  if (isCurve) {
    return curvePreviewFallback
  }

  return tokenPreviewFallback
}
