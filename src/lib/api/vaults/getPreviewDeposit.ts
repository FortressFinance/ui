import { fortressApi } from "@/lib/api/util"
import { handledResponse } from "@/lib/api/util/handledResponse"
import { PreviewTransactionGetterArgs } from "@/hooks/data/preview"

type PreviewDepositData = {
  id: number
  resultWei: string
  resultFormatted?: string
}

export async function getCompounderVaultsPreviewDeposit(
  args: PreviewTransactionGetterArgs
) {
  const resp = await fortressApi.post<PreviewDepositData>(
    "AMM_Compounder/previewDeposit",
    args
  )
  return handledResponse(resp?.data?.data)
}

export async function getTokenVaultsPreviewDeposit(
  args: PreviewTransactionGetterArgs
) {
  const resp = await fortressApi.post<PreviewDepositData>(
    "Token_Compounder/previewDeposit",
    args
  )
  return handledResponse(resp?.data?.data)
}
