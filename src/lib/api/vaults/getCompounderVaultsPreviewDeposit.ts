import { Address } from "wagmi"

import { handledResponse } from "@/lib/api/util/handledResponse"
import fortressApi from "@/lib/fortressApi"

export type PreviewData = {
  id: number
  resultWei: number
  resultFormated: string
}

export async function getCompounderVaultsPreviewDeposit({
  chainId,
  isCurve,
  id,
  token = "0x",
  amount,
  slippage,
}: {
  chainId: number
  isCurve: boolean
  id: number | undefined
  token: Address | undefined,
  amount: string,
  slippage: number
}) {
  const resp = await fortressApi.post<PreviewData>(
    "AMM_Compounder/previewDeposit",
    { isCurve, chainId, id, token, amount, slippage }
  )
  return handledResponse(resp?.data?.data)
}