import { fortressApi, handledResponse } from "@/lib/api/util"
import { ConcentratorPreviewTransactionGetterArgs } from "@/hooks/lib/api/types"

type ConcentratorPreviewData = {
  targetAssetId: number
  concentratorId: number
  minAmountWei?: string
  resultWei: string
}

export async function getConcentratorPreviewDeposit(
  args: ConcentratorPreviewTransactionGetterArgs
) {
  const resp = await fortressApi.post<ConcentratorPreviewData>(
    "Concentrator/previewDeposit",
    args
  )
  return handledResponse(resp?.data?.data)
}
