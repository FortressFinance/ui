import { VaultPreviewTransactionArgs } from "@/hooks/lib/api/types"
import useCurvePreviewDepositFallback from "@/hooks/lib/preview/compounder/useCurvePreviewDepositFallback"
import useTokenPreviewDepositFallback from "@/hooks/lib/preview/compounder/useTokenPreviewDepositFallback"
import { useIsCurveVault, useIsTokenVault } from "@/hooks/useVaultTypes"

import { useSlippageTolerance } from "@/store"

export function useCompounderPreviewDeposit({
  enabled,
  type,
  ...rest
}: VaultPreviewTransactionArgs) {
  const isToken = useIsTokenVault(type)
  const isCurve = useIsCurveVault(type)

  const curvePreviewFallback = useCurvePreviewDepositFallback({
    ...rest,
    type,
    // we store slippage as a fraction of 100; api expects slippage as a fraction of 1
    slippage: useSlippageTolerance() / 100,
    enabled: enabled && isCurve,
  })

  const tokenPreviewFallback = useTokenPreviewDepositFallback({
    ...rest,
    slippage: useSlippageTolerance() / 100,
    enabled: enabled && isToken,
  })

  return tokenPreviewFallback.isSuccess && isToken
    ? tokenPreviewFallback
    : curvePreviewFallback
}
