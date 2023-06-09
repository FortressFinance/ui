import { Address } from "wagmi"

import useTokenPreviewDeposit from "@/hooks/lib/preview/compounder/useTokenPreviewDeposit"

export default function useTokenPreviewDepositUnderlying({
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
  return useTokenPreviewDeposit({
    token,
    amount,
    slippage,
    enabled,
  })
}
