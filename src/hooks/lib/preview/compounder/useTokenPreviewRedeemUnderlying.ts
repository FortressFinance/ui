import { Address } from "wagmi"

import useTokenPreviewRedeem from "@/hooks/lib/preview/compounder/useTokenPreviewRedeem"

export default function useTokenPreviewRedeemUnderlying({
  token,
  amount,
  slippage,
  enabled,
}: {
  token?: Address
  amount: string
  slippage: number
  enabled: boolean
}) {
  return useTokenPreviewRedeem({
    token,
    amount,
    slippage,
    enabled,
  })
}
