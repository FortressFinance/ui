import { useQuery } from "@tanstack/react-query"

import { getTokenVaultsPreviewRedeem } from "@/lib/api/vaults"
import { queryKeys } from "@/lib/helpers"
import { PreviewVaultSpecificTransactionArgs } from "@/hooks/lib/api/types"

export function useTokenPreviewRedeem({
  enabled,
  onError,
  onSuccess,
  ...args
}: PreviewVaultSpecificTransactionArgs) {
  return useQuery({
    ...queryKeys.vaults.previewTokenRedeem(args),
    queryFn: () => getTokenVaultsPreviewRedeem(args),
    retry: false,
    enabled,
    onSuccess,
    onError,
  })
}
