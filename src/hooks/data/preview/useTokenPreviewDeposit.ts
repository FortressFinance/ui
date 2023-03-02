import { useQuery } from "@tanstack/react-query"

import { getTokenVaultsPreviewDeposit } from "@/lib/api/vaults"
import { queryKeys } from "@/lib/helpers"
import { PreviewVaultSpecificTransactionArgs } from "@/hooks/data/preview/types"

export function useTokenPreviewDeposit({
  enabled,
  onError,
  onSuccess,
  ...args
}: PreviewVaultSpecificTransactionArgs) {
  return useQuery({
    ...queryKeys.vaults.previewTokenDeposit(args),
    queryFn: () => getTokenVaultsPreviewDeposit(args),
    retry: false,
    enabled,
    onSuccess,
    onError,
  })
}
