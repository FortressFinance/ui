import { Address } from "wagmi"

import { VaultType } from "@/lib/types"
import useCurvePreviewDeposit from "@/hooks/lib/preview/compounder/useCurvePreviewDeposit"

export default function useCurvePreviewDepositUnderlying({
  asset,
  vaultAddress,
  token,
  amount,
  type,
  slippage,
  enabled,
}: {
  asset: Address
  vaultAddress: Address
  token?: Address
  amount: string
  type: VaultType
  slippage: number
  enabled: boolean
}) {
  return useCurvePreviewDeposit({
    asset,
    vaultAddress,
    token,
    amount,
    type,
    slippage,
    enabled,
  })
}
