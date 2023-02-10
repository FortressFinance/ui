import { Address } from "wagmi"

import { handledResponse } from "@/lib/api/util/handledResponse"
import fortressApi from "@/lib/fortressApi"

export type PreviewDepositData = {
  id: number
  resultWei: number
  resultFormated: string
}

export async function getCompounderVaultsPreview({
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
  const resp = await fortressApi.post<PreviewDepositData>(
    "AMM_Compounder/previewDeposit",
    { isCurve, chainId, id, token, amount, slippage }
  )
  return handledResponse(resp?.data?.data)
}