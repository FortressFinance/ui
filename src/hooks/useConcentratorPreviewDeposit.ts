import { useQuery } from "@tanstack/react-query"

import { getConcentratorPreviewDepositAmmVault } from "@/lib/api/concentrators"
import { queryKeys } from "@/lib/helpers"
import { ConcentratorPreviewTransactionArgs } from "@/hooks/lib/api/types"

import { useGlobalStore } from "@/store"

export function useConcentratorPreviewDeposit({
  enabled = true,
  onError,
  onSuccess,
  ...rest
}: ConcentratorPreviewTransactionArgs) {
  const args = {
    ...rest,
    // we store slippage as a fraction of 100; api expects slippage as a fraction of 1
    slippage: useGlobalStore((store) => store.slippageTolerance) / 100,
  }
  return useQuery({
    ...queryKeys.concentrators.previewDeposit(args),
    queryFn: () => getConcentratorPreviewDepositAmmVault({ ...args }),
    keepPreviousData: args.amount !== "0",
    refetchInterval: args.amount !== "0" ? 20000 : false,
    refetchIntervalInBackground: false,
    enabled: args.amount !== "0" && enabled,
    onError,
    onSuccess,
  })
}
