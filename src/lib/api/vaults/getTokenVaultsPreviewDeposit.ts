import { Address } from "wagmi"

import { handledResponse } from "@/lib/api/util"
import { PreviewData } from "@/lib/api/vaults/getCompounderVaultsPreviewDeposit"
import fortressApi from "@/lib/fortressApi"

export async function getTokenVaultsPreviewDeposit({
  chainId,
  id,
  token = "0x",
  amount,
}: {
  chainId: number
  id: number | undefined
  token: Address | undefined
  amount: string
}) {
  const resp = await fortressApi.post<PreviewData>(
    "Token_Compounder/previewDeposit",
    { chainId, id, token, amount }
  )
  return handledResponse(resp?.data?.data)
}
