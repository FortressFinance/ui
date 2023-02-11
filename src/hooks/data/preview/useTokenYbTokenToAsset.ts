import { useQuery } from "@tanstack/react-query"
import { Address } from "wagmi"

import { getTokenVaultsPreviewRedeem } from "@/lib/api/vaults/getTokenVaultsPreviewRedeem"
import { queryKeys } from "@/lib/helpers"

export function useTokenYbTokenToAsset({
  chainId,
  id,
  token = "0x",
  amount,
  enabled,
}: {
  chainId: number
  id: number | undefined
  token: Address | undefined,
  amount: string,
  enabled: boolean
}) {

  return useQuery({
    ...queryKeys.vaults.previewTokenRedeem({ chainId, id, token, amount }),
    queryFn: () => getTokenVaultsPreviewRedeem({chainId, id, token, amount }),
    retry: false,
    enabled,
  })
}