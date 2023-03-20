import { fortressApi } from "@/lib/api/util"
import { handledResponse } from "@/lib/api/util/handledResponse"
import { PreviewTransactionGetterArgs } from "@/hooks/lib/api/types"

export type PreviewData = {
  id: number
  minAmountWei?: string
  resultWei: string
  resultFormatted?: string
}

export async function getPreviewDepositAmmVault(
  args: PreviewTransactionGetterArgs
) {
  const resp = await fortressApi.post<PreviewData>(
    "AMM_Compounder/previewDeposit",
    args
  )
  return handledResponse(resp?.data?.data)
}

export async function getPreviewDepositTokenVault(
  args: PreviewTransactionGetterArgs
) {
  const resp = await fortressApi.post<PreviewData>(
    "Token_Compounder/previewDeposit",
    args
  )
  return handledResponse(resp?.data?.data)
}
