import { Address } from "wagmi"

import useCalcRedeemGlp from "@/hooks/lib/preview/compounder/useCalcRedeemGlp"

export default function useTokenPreviewRedeem({
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
  const amountOut = useCalcRedeemGlp({
    amount,
    token: token ?? "0x",
    enabled,
  })

  const amountOutWithSlippage = Number(amountOut) * (1 + slippage)
  return {
    isLoading: false,
    isFetching: false,
    isSuccess: true,
    data: parseInt(amountOutWithSlippage.toFixed(2)),
  }
}
