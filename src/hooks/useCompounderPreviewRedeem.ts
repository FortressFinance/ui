import { useQuery } from "@tanstack/react-query"

import {
  getPreviewRedeemAmmVault,
  getPreviewRedeemTokenVault,
} from "@/lib/api/vaults"
import { queryKeys } from "@/lib/helpers"
import { PreviewTransactionBaseArgs } from "@/hooks/lib/api/types"
import { useVaultPoolId } from "@/hooks/useVaultPoolId"

import { useSlippageTolerance } from "@/store"

export function useCompounderPreviewRedeem({
  enabled = true,
  type,
  onError,
  onSuccess,
  ...rest
}: PreviewTransactionBaseArgs) {
  const { data: poolId } = useVaultPoolId({
    asset: rest.asset ?? "0x",
    type: type ?? "curve",
  })
  const args = {
    amount: rest.amount,
    chainId: rest.chainId,
    token: rest.token,
    id: poolId,
    // we store slippage as a fraction of 100; api expects slippage as a fraction of 1
    slippage: useSlippageTolerance() / 100,
  }
  return useQuery({
    ...queryKeys.vaults.previewRedeem(args),
    queryFn: () =>
      type === "token"
        ? getPreviewRedeemTokenVault(args)
        : getPreviewRedeemAmmVault({ ...args, isCurve: type === "curve" }),
    keepPreviousData: args.amount !== "0",
    refetchInterval: args.amount !== "0" ? 20000 : false,
    refetchIntervalInBackground: false,
    enabled: args.amount !== "0" && enabled,
    onError,
    onSuccess,
  })
}
