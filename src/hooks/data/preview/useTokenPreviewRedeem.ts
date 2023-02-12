import { useQuery } from "@tanstack/react-query"
import { Address } from "wagmi"

import { PreviewData } from "@/lib/api/vaults/getCompounderVaultsPreviewDeposit"
import { getTokenVaultsPreviewRedeem } from "@/lib/api/vaults/getTokenVaultsPreviewRedeem"
import { queryKeys } from "@/lib/helpers"

export function useTokenPreviewRedeem({
  chainId,
  id,
  token = "0x",
  amount,
  enabled,
  onSuccess,
  onError
}: {
  chainId: number
  id: number | undefined
  token: Address | undefined
  amount: string
  enabled: boolean
  onSuccess: ((data: PreviewData) => void) | undefined
  onError: ((err: unknown) => void) | undefined
}) {

  return useQuery({
    ...queryKeys.vaults.previewTokenRedeem({ chainId, id, token, amount }),
    queryFn: () => getTokenVaultsPreviewRedeem({chainId, id, token, amount }),
    retry: false,
    enabled,
    onSuccess,
    onError
  })
}