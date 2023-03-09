import {
  PreviewTransactionArgs,
  useBalancerPreviewDeposit,
  useCurvePreviewDeposit,
  useTokenPreviewDeposit,
} from "@/hooks/data/preview"
import {
  useIsCurveCompounder,
  useIsTokenCompounder,
} from "@/hooks/useVaultTypes"

import { useTxSettings } from "@/store/txSettings"

// !NOTE
// !The result of this hook must be account for slippage
// * this is consumed in the VaultDepositForm & VaultWithdrawForm components
// * the result is used as a minAmount value when preparing transactions

export function usePreviewDeposit({
  enabled = true,
  type,
  ...args
}: PreviewTransactionArgs) {
  const isCurve = useIsCurveCompounder(type)
  const isToken = useIsTokenCompounder(type)

  const slippage = useTxSettings((store) => store.slippageTolerance)

  const enableCurveAssetToYbToken = !isToken && isCurve
  const curvePreviewQuery = useCurvePreviewDeposit({
    ...args,
    slippage,
    enabled: enabled && enableCurveAssetToYbToken,
  })

  const enableBalancerAssetToYbToken = !isToken && !isCurve
  const balancerPreviewQuery = useBalancerPreviewDeposit({
    ...args,
    slippage,
    enabled: enabled && enableBalancerAssetToYbToken,
  })

  const enableTokenAssetToYbToken = isToken
  const tokenPreviewQuery = useTokenPreviewDeposit({
    ...args,
    slippage,
    enabled: enabled && enableTokenAssetToYbToken,
  })

  if (enableCurveAssetToYbToken) {
    return curvePreviewQuery
  }

  if (enableBalancerAssetToYbToken) {
    return balancerPreviewQuery
  }

  return tokenPreviewQuery
}
