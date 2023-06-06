import { Address } from "wagmi"

import useCalcRedeemGlp from "@/hooks/lib/preview/compounder/useCalcRedeemGlp"

export default function useTokenPreviewRedeem({
  token,
  amount,
  enabled,
}: {
  token?: Address
  amount: string
  enabled: boolean
}) {
  const amountOut = useCalcRedeemGlp({
    amount,
    token: token ?? "0x",
    enabled,
  })

  return {
    isLoading: false,
    data: amountOut,
  }
}
