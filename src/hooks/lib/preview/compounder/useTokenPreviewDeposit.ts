import { Address } from "wagmi"

import useCalcMintGlp from "@/hooks/lib/preview/compounder/useCalcMintGlp"

export default function useTokenPreviewDeposit({
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
  const amountOut = useCalcMintGlp({
    amount,
    token: token ?? "0x",
    enabled,
  })

  const amountOutWithSlippage = Number(amountOut) * (1 + slippage)
  return {
    isLoading: false,
    isFetching: false,
    isSuccess: true,
    data: parseInt(
      amountOutWithSlippage.toLocaleString("fullwide", { useGrouping: false })
    ),
  }
}
