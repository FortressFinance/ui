import { useQuery } from "@tanstack/react-query"
import { Address } from "wagmi"

import { getTokenVaultsPreviewDeposit } from "@/lib/api/vaults/getTokenVaultsPreviewDeposit"
import { queryKeys } from "@/lib/helpers"

export function useTokenAssetToYbToken({
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
    ...queryKeys.vaults.previewTokenDeposit({ chainId, id, token, amount }),
    queryFn: () => getTokenVaultsPreviewDeposit({chainId, id, token, amount }),
    retry: false,
    enabled,
  })
}