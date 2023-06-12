import { Address } from "wagmi"

import useCurvePreviewRedeem from "@/hooks/lib/preview/compounder/useCurvePreviewRedeem"

export default function usePreviewRedeemUnderlying({
  primaryAsset,
  token,
  amount,
  slippage,
  enabled,
}: {
  primaryAsset: Address
  token?: Address
  amount: string
  slippage: number
  enabled: boolean
}) {
  return useCurvePreviewRedeem({
    asset: primaryAsset,
    token,
    amount,
    type: "curve",
    slippage,
    enabled,
  })
}
