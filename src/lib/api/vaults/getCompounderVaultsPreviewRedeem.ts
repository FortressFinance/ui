import { Address } from "wagmi"

import { handledResponse } from "@/lib/api/util/handledResponse"
import { PreviewData } from "@/lib/api/vaults/getCompounderVaultsPreviewDeposit"
import fortressApi from "@/lib/fortressApi"

export async function getCompounderVaultsPreviewRedeem({
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
    "AMM_Compounder/previewRedeem",
    { isCurve, chainId, id, token, ybTokenAmount: amount, slippage }
  )
  return handledResponse(resp?.data?.data)
}