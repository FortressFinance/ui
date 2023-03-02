import { Address } from "wagmi"

import { fortressApi, handledResponse } from "@/lib/api/util"
import { PreviewData } from "@/lib/api/vaults/getPreviewDeposit"

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
  token: Address | undefined
  amount: string
  slippage: number
}) {
  const resp = await fortressApi.post<PreviewData>(
    "AMM_Compounder/previewRedeem",
    { isCurve, chainId, id, token, ybTokenAmount: amount, slippage }
  )
  return handledResponse(resp?.data?.data)
}

export async function getTokenVaultsPreviewRedeem({
  chainId,
  id,
  token = "0x",
  amount,
}: {
  chainId: number
  id?: number
  token?: Address
  amount: string
}) {
  const resp = await fortressApi.post<PreviewData>(
    "Token_Compounder/previewRedeem",
    { chainId, id, token, amount }
  )
  return handledResponse(resp?.data?.data)
}
