import { useQuery } from "@tanstack/react-query"
import { Address } from "wagmi"

import { getCompounderVaultsPreview } from "@/lib/api/vaults/getCompounderVaultsPreview"
import { queryKeys } from "@/lib/helpers"

export function useCurveAssetToYbToken({
  chainId,
  id,
  token = "0x",
  amount,
  slippage,
  enabled,
}: {
  chainId: number
  id: number | undefined
  token: Address | undefined,
  amount: string,
  slippage: number,
  enabled: boolean
}) {

  return useQuery({
    ...queryKeys.vaults.previewDeposit({ chainId, isCurve:true, id, token, amount, slippage }),
    queryFn: () => getCompounderVaultsPreview({chainId, isCurve:true, id, token, amount, slippage}),
    retry: false,
    enabled,
  })
}