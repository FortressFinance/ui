import { PreviewTransactionArgs } from "@/hooks/lib/api/types"
import { useBalancerPreviewRedeem } from "@/hooks/lib/api/useBalancerPreviewRedeem"
import { useCurvePreviewRedeem } from "@/hooks/lib/api/useCurvePreviewRedeem"
import { useTokenPreviewRedeem } from "@/hooks/lib/api/useTokenPreviewRedeem"
import {
  useIsCurveCompounder,
  useIsTokenCompounder,
} from "@/hooks/useVaultTypes"

import { useTxSettings } from "@/store/txSettings"

// !NOTE
// !The result of this hook must be account for slippage
// * this is consumed in the VaultDepositForm & VaultWithdrawForm components
// * the result is used as a minAmount value when preparing transactions

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
