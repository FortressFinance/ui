import {
  getPreviewRedeemAmmVault,
  getPreviewRedeemTokenVault,
} from "@/lib/api/vaults"
import { queryKeys } from "@/lib/helpers"
import { PreviewTransactionBaseArgs } from "@/hooks/lib/api/types"
import useCurvePreviewRedeemFallback from "@/hooks/lib/preview/compounder/useCurvePreviewRedeemFallback"
import useTokenPreviewRedeemFallback from "@/hooks/lib/preview/compounder/useTokenPreviewRedeemFallback"
import { useQueryWithStatus } from "@/hooks/useQueryWithStatus"
import { useVaultPoolId } from "@/hooks/useVaultPoolId"
import { useIsCurveVault, useIsTokenVault } from "@/hooks/useVaultTypes"

import { useSlippageTolerance } from "@/store"

export function useCompounderPreviewRedeem({
  enabled,
  type,
  onError,
  onSuccess,
  ...rest
}: PreviewTransactionBaseArgs) {
  const isToken = useIsTokenVault(type)
  const isCurve = useIsCurveVault(type)

  const { data: poolId } = useVaultPoolId({
    asset: rest.asset ?? "0x",
    type: type ?? "curve",
    enabled,
  })
  const args = {
    amount: rest.amount,
    chainId: rest.chainId,
    token: rest.token,
    id: poolId,
    // we store slippage as a fraction of 100; api expects slippage as a fraction of 1
    slippage: useSlippageTolerance() / 100,
  }

  const apiQuery = useQueryWithStatus({
    ...queryKeys.vaults.previewRedeem(args),
    queryFn: () =>
      isToken
        ? getPreviewRedeemTokenVault(args)
        : getPreviewRedeemAmmVault({ ...args, isCurve: type === "curve" }),
    keepPreviousData: args.amount !== "0",
    refetchInterval: args.amount !== "0" ? 20000 : false,
    refetchIntervalInBackground: false,
    enabled: args.amount !== "0" && enabled,
    onError,
    onSuccess,
  })

  const curvePreviewFallback = useCurvePreviewRedeemFallback({
    ...rest,
    type,
    slippage: args.slippage,
    enabled: enabled && isCurve,
  })

  const tokenPreviewFallback = useTokenPreviewRedeemFallback({
    ...rest,
    slippage: args.slippage,
    enabled: enabled && isToken,
  })

  if (apiQuery.isError && isCurve) {
    return curvePreviewFallback
  }

  if (apiQuery.isError && isToken) {
    return tokenPreviewFallback
  }

  return apiQuery
}
