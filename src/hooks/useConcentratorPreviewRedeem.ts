import { VaultPreviewTransactionArgs } from "@/hooks/lib/api/types"
import usePreviewRedeemFallback from "@/hooks/lib/preview/concentrator/usePreviewRedeemFallback"

import { useSlippageTolerance } from "@/store"

export function useConcentratorPreviewRedeem({
  enabled,
  ...rest
}: VaultPreviewTransactionArgs) {
  return usePreviewRedeemFallback({
    ...rest,
    primaryAsset: rest.vaultAddress,
    targetAsset: rest.asset,
    // we store slippage as a fraction of 100; api expects slippage as a fraction of 1
    slippage: useSlippageTolerance() / 100,
    enabled,
  })
}
