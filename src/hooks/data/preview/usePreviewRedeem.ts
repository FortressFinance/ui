import {
  PreviewTransactionArgs,
  useBalancerPreviewRedeem,
  useCurvePreviewRedeem,
  useTokenPreviewRedeem,
} from "@/hooks/data/preview"
import {
  useIsCurveCompounder,
  useIsTokenCompounder,
} from "@/hooks/useVaultTypes"

import { useTxSettings } from "@/store/txSettings"

export function usePreviewRedeem({
  enabled = true,
  type,
  ...args
}: PreviewTransactionArgs) {
  const isCurve = useIsCurveCompounder(type)
  const isToken = useIsTokenCompounder(type)

  const slippage = useTxSettings((store) => store.slippageTolerance)

  const enableCurveAssetToYbToken = enabled && !isToken && isCurve
  const curvePreviewQuery = useCurvePreviewRedeem({
    ...args,
    slippage,
    enabled: enableCurveAssetToYbToken,
  })

  const enableBalancerAssetToYbToken = enabled && !isToken && !isCurve
  const balancerPreviewQuery = useBalancerPreviewRedeem({
    ...args,
    slippage,
    enabled: enableBalancerAssetToYbToken,
  })

  const enableTokenAssetToYbToken = enabled && isToken
  const tokenPreviewQuery = useTokenPreviewRedeem({
    ...args,
    slippage,
    enabled: enableTokenAssetToYbToken,
  })

  if (enableCurveAssetToYbToken) {
    return curvePreviewQuery
  }

  if (enableBalancerAssetToYbToken) {
    return balancerPreviewQuery
  }

  return tokenPreviewQuery
}
