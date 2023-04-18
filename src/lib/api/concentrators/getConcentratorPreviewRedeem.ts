import { fortressApi, handledResponse } from "@/lib/api/util"
import { ConcentratorPreviewTransactionGetterArgs } from "@/hooks/lib/api/types"

type ConcentratorRedeemData = {
  targetAssetId: number
  concentratorId: number
  minAmountWei?: string
  resultWei: string
}

export async function getConcentratorPreviewRedeem({
  amount: ybTokenAmount,
  ...args
}: ConcentratorPreviewTransactionGetterArgs) {
  const resp = await fortressApi.post<ConcentratorRedeemData>(
    "Concentrator/previewRedeem",
    { ...args, ybTokenAmount }
  )
  return handledResponse(resp?.data?.data)
}
