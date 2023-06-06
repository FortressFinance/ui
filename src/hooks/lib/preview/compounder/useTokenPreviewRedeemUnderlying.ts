import { Address } from "wagmi"

import useTokenPreviewRedeem from "@/hooks/lib/preview/compounder/useTokenPreviewRedeem"

export default function useTokenPreviewRedeemUnderlying({
  token,
  amount,
  enabled,
}: {
  token?: Address
  amount: string
  enabled: boolean
}) {
  return useTokenPreviewRedeem({
    token,
    amount,
    enabled,
  })
}
