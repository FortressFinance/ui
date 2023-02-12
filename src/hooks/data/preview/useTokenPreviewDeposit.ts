import { useQuery } from "@tanstack/react-query"
import { Address } from "wagmi"

import { PreviewData } from "@/lib/api/vaults/getCompounderVaultsPreviewDeposit"
import { getTokenVaultsPreviewDeposit } from "@/lib/api/vaults/getTokenVaultsPreviewDeposit"
import { queryKeys } from "@/lib/helpers"

export function useTokenPreviewDeposit({
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
    ...queryKeys.vaults.previewTokenDeposit({ chainId, id, token, amount }),
    queryFn: () => getTokenVaultsPreviewDeposit({ chainId, id, token, amount }),
    retry: false,
    enabled,
    onSuccess,
    onError
  })
}
