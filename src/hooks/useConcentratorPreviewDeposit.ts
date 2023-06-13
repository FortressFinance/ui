import { useQuery } from "@tanstack/react-query"

import { getConcentratorPreviewDeposit } from "@/lib/api/concentrators"
import { queryKeys } from "@/lib/helpers"
import { VaultPreviewTransactionArgs } from "@/hooks/lib/api/types"
import usePreviewDepositFallback from "@/hooks/lib/preview/concentrator/usePreviewDepositFallback"
import { useConcentratorFirstVaultType } from "@/hooks/useConcentratorFirstVaultType"
import { useConcentratorId } from "@/hooks/useConcentratorId"
import { useConcentratorTargetAssetId } from "@/hooks/useConcentratorTargetAssetId"

import { useGlobalStore } from "@/store"

export function useConcentratorPreviewDeposit({
  enabled,
  onError,
  onSuccess,
  ...rest
}: VaultPreviewTransactionArgs) {
  const { data: targetAssetId } = useConcentratorTargetAssetId({
    targetAsset: rest.asset,
    enabled,
  })

  const { data: concentratorId } = useConcentratorId({
    primaryAsset: rest.vaultAddress,
    targetAsset: rest.asset,
    enabled,
  })

  const firstConcentratorVaultType = useConcentratorFirstVaultType({
    targetAsset: rest.asset,
    enabled,
  })

  const args = {
    amount: rest.amount,
    chainId: rest.chainId,
    token: rest.token,
    targetAssetId,
    concentratorId,
    isCurve: firstConcentratorVaultType === "curve",
    // we store slippage as a fraction of 100; api expects slippage as a fraction of 1
    slippage: useGlobalStore((store) => store.slippageTolerance) / 100,
  }

  const apiQuery = useQuery({
    ...queryKeys.concentrators.previewDeposit(args),
    queryFn: () => getConcentratorPreviewDeposit({ ...args }),
    keepPreviousData: args.amount !== "0",
    refetchInterval: args.amount !== "0" ? 20000 : false,
    refetchIntervalInBackground: false,
    enabled: args.amount !== "0" && enabled,
    onError,
    onSuccess,
  })

  const previewFallback = usePreviewDepositFallback({
    ...rest,
    primaryAsset: rest.vaultAddress,
    targetAsset: rest.asset,
    slippage: args.slippage,
    enabled: apiQuery.isError && enabled,
  })

  return apiQuery.isError ? previewFallback : apiQuery
}
