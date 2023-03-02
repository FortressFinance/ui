import { useQuery } from "@tanstack/react-query"
import { Address } from "wagmi"

import { getTokenVaultsPreviewRedeem, PreviewData } from "@/lib/api/vaults"
import { queryKeys } from "@/lib/helpers"

export function useTokenPreviewRedeem({
  chainId,
  id,
  token = "0x",
  amount,
  enabled,
  onSuccess,
  onError,
}: {
  chainId: number
  id?: number
  token?: Address
  amount: string
  enabled: boolean
  onSuccess?: (data: PreviewData) => void
  onError?: (err: unknown) => void
}) {
  return useQuery({
    ...queryKeys.vaults.previewTokenRedeem({ chainId, id, token, amount }),
    queryFn: () => getTokenVaultsPreviewRedeem({ chainId, id, token, amount }),
    retry: false,
    enabled,
    onSuccess,
    onError,
  })
}
