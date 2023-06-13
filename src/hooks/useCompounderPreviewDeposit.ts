import { useQuery } from "@tanstack/react-query"

import {
  getPreviewDepositAmmVault,
  getPreviewDepositTokenVault,
} from "@/lib/api/vaults"
import { queryKeys } from "@/lib/helpers"
import { VaultPreviewTransactionArgs } from "@/hooks/lib/api/types"
import useCurvePreviewDepositFallback from "@/hooks/lib/preview/compounder/useCurvePreviewDepositFallback"
import useTokenPreviewDepositFallback from "@/hooks/lib/preview/compounder/useTokenPreviewDepositFallback"
import { useVaultPoolId } from "@/hooks/useVaultPoolId"
import { useIsCurveVault, useIsTokenVault } from "@/hooks/useVaultTypes"

import { useGlobalStore } from "@/store"

export function useCompounderPreviewDeposit({
  enabled,
  type,
  onError,
  onSuccess,
  ...rest
}: VaultPreviewTransactionArgs) {
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
    slippage: useGlobalStore((store) => store.slippageTolerance) / 100,
  }

  const apiQuery = useQuery({
    ...queryKeys.vaults.previewDeposit(args),
    queryFn: () =>
      type === "token"
        ? getPreviewDepositTokenVault(args)
        : getPreviewDepositAmmVault({ ...args, isCurve: type === "curve" }),
    keepPreviousData: args.amount !== "0",
    refetchInterval: args.amount !== "0" ? 20000 : false,
    refetchIntervalInBackground: false,
    enabled: args.amount !== "0" && enabled,
    onError,
    onSuccess,
  })

  const curvePreviewFallback = useCurvePreviewDepositFallback({
    ...rest,
    type,
    slippage: args.slippage,
    enabled: apiQuery.isError && enabled && isCurve,
  })

  const tokenPreviewFallback = useTokenPreviewDepositFallback({
    ...rest,
    slippage: args.slippage,
    enabled: apiQuery.isError && enabled && isToken,
  })

  return apiQuery.isError && isCurve
    ? curvePreviewFallback
    : apiQuery.isError && isToken
    ? tokenPreviewFallback
    : apiQuery
}
