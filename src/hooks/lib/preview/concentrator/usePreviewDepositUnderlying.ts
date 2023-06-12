import { Address } from "wagmi"

import useCurvePreviewDeposit from "@/hooks/lib/preview/useCurvePreviewDeposit"

export default function usePreviewDepositUnderlying({
  primaryAsset,
  ybTokenAddress,
  token,
  amount,
  slippage,
  enabled,
}: {
  primaryAsset: Address
  ybTokenAddress: Address
  token?: Address
  amount: string
  slippage: number
  enabled: boolean
}) {
  return useCurvePreviewDeposit({
    asset: primaryAsset,
    vaultAddress: ybTokenAddress,
    token,
    amount,
    type: "curve",
    slippage,
    enabled,
  })
}
