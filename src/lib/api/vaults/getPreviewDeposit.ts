import { fortressApi } from "@/lib/api/util"
import { handledResponse } from "@/lib/api/util/handledResponse"
import { PreviewTransactionGetterArgs } from "@/hooks/data/preview"

export type PreviewData = {
  id: number
  resultWei: number
  resultFormatted: string
}

export async function getCompounderVaultsPreviewDeposit(
  args: PreviewTransactionGetterArgs
) {
  const resp = await fortressApi.post<PreviewData>(
    "AMM_Compounder/previewDeposit",
    args
  )
  return handledResponse(resp?.data?.data)
}

export async function getTokenVaultsPreviewDeposit(
  args: PreviewTransactionGetterArgs
) {
  const resp = await fortressApi.post<PreviewData>(
    "Token_Compounder/previewDeposit",
    args
  )
  return handledResponse(resp?.data?.data)
}
