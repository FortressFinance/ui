import { Address } from "wagmi"

import { fortressApi, handledResponse } from "@/lib/api/util"
import { CompounderPreviewTransactionGetterArgs } from "@/hooks/lib/api/types"

type PreviewRedeemData = {
  id: number
  asset_amount: number
  minAmountWei?: string
  resultWei: string
  ybToken_address: Address
  ybToken_symbol: string
  yb_amount: number
}

export async function getPreviewRedeemAmmVault({
  amount: ybTokenAmount,
  ...args
}: CompounderPreviewTransactionGetterArgs) {
  const resp = await fortressApi.post<PreviewRedeemData>(
    "AMM_Compounder/previewRedeem",
    { ...args, ybTokenAmount }
  )
  return handledResponse(normalizeResponse(resp?.data?.data))
}

export async function getPreviewRedeemTokenVault(
  args: CompounderPreviewTransactionGetterArgs
) {
  const resp = await fortressApi.post<PreviewRedeemData>(
    "Token_Compounder/previewRedeem",
    args
  )
  return handledResponse(normalizeResponse(resp?.data?.data))
}

function normalizeResponse(data?: PreviewRedeemData | null) {
  return data
    ? {
        id: data.id,
        minAmountWei: data.minAmountWei,
        resultWei: data.resultWei,
      }
    : undefined
}
