import { Address } from "wagmi"

import { VaultType } from "@/lib/types"
import useCurvePreviewRedeem from "@/hooks/lib/preview/compounder/useCurvePreviewRedeem"

export default function useCompounderPreviewRedeemUnderlying({
  asset,
  token,
  amount,
  type,
  slippage,
  enabled,
}: {
  asset: Address
  token?: Address
  amount: string
  type: VaultType
  slippage: number
  enabled: boolean
}) {
  return useCurvePreviewRedeem({
    asset,
    token,
    amount,
    type,
    slippage,
    enabled,
  })
}
