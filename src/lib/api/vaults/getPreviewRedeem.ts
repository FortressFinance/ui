import { fortressApi, handledResponse } from "@/lib/api/util"
import { PreviewData } from "@/lib/api/vaults/getPreviewDeposit"
import { PreviewTransactionGetterArgs } from "@/hooks/data/preview"

export async function getCompounderVaultsPreviewRedeem({
  amount: ybTokenAmount,
  ...args
}: PreviewTransactionGetterArgs) {
  const resp = await fortressApi.post<PreviewData>(
    "AMM_Compounder/previewRedeem",
    { ...args, ybTokenAmount }
  )
  return handledResponse(resp?.data?.data)
}

export async function getTokenVaultsPreviewRedeem({
  slippage: _slippage,
  ...args
}: PreviewTransactionGetterArgs) {
  const resp = await fortressApi.post<PreviewData>(
    "Token_Compounder/previewRedeem",
    args
  )
  return handledResponse(resp?.data?.data)
}
