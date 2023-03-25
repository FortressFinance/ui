import { useQuery } from "@tanstack/react-query"

import {
  getPreviewRedeemAmmVault,
  getPreviewRedeemTokenVault,
} from "@/lib/api/vaults"
import { queryKeys } from "@/lib/helpers"
import { PreviewTransactionArgs } from "@/hooks/lib/api/types"

import { useGlobalStore } from "@/store"

export function usePreviewRedeem({
  enabled = true,
  type,
  onError,
  onSuccess,
  ...rest
}: PreviewTransactionArgs) {
  const args = {
    ...rest,
    // we store slippage as a fraction of 100; api expects slippage as a fraction of 1
    slippage: useGlobalStore((store) => store.slippageTolerance) / 100,
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
