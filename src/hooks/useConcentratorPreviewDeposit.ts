import { VaultPreviewTransactionArgs } from "@/hooks/lib/api/types"
import usePreviewDepositFallback from "@/hooks/lib/preview/concentrator/usePreviewDepositFallback"

import { useSlippageTolerance } from "@/store"

export function useConcentratorPreviewDeposit({
  enabled,
  ...rest
}: VaultPreviewTransactionArgs) {
  return usePreviewDepositFallback({
    ...rest,
    primaryAsset: rest.vaultAddress,
    targetAsset: rest.asset,
    // we store slippage as a fraction of 100; api expects slippage as a fraction of 1
    slippage: useSlippageTolerance() / 100,
    enabled,
  })
}
