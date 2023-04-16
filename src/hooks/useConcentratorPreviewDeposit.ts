import { useQuery } from "@tanstack/react-query"

import { getConcentratorPreviewDeposit } from "@/lib/api/concentrators"
import { queryKeys } from "@/lib/helpers"
import { VaultPreviewTransactionArgs } from "@/hooks/lib/api/types"
import { useConcentratorId } from "@/hooks/useConcentratorId"
import { useConcentratorTargetAssetId } from "@/hooks/useConcentratorTargetAssetId"
import { useIsConcentratorCurveVault } from "@/hooks/useVaultTypes"

import { useGlobalStore } from "@/store"

export function useConcentratorPreviewDeposit({
  enabled = true,
  onError,
  onSuccess,
  ...rest
}: VaultPreviewTransactionArgs) {
  const { data: targetAssetId } = useConcentratorTargetAssetId({
    targetAsset: rest.asset,
  })
  const { data: concentratorId } = useConcentratorId({
    primaryAsset: rest.vaultAddress,
    targetAsset: rest.asset,
  })
  const isCurve = useIsConcentratorCurveVault(rest.vaultAddress)

  const args = {
    amount: rest.amount,
    chainId: rest.chainId,
    token: rest.token,
    targetAssetId,
    concentratorId,
    isCurve,
    // we store slippage as a fraction of 100; api expects slippage as a fraction of 1
    slippage: useGlobalStore((store) => store.slippageTolerance) / 100,
  }
  return useQuery({
    ...queryKeys.concentrators.previewDeposit(args),
    queryFn: () => getConcentratorPreviewDeposit({ ...args }),
    keepPreviousData: args.amount !== "0",
    refetchInterval: args.amount !== "0" ? 20000 : false,
    refetchIntervalInBackground: false,
    enabled: args.amount !== "0" && enabled,
    onError,
    onSuccess,
  })
}
