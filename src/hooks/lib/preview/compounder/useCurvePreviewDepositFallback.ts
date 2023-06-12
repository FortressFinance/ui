import { Address, useContractRead } from "wagmi"

import { VaultType } from "@/lib/types"
import useCurvePreviewDepositUnderlying from "@/hooks/lib/preview/compounder/useCurvePreviewDepositUnderlying"
import { useVaultContract } from "@/hooks/lib/useVaultContract"

export default function useCurvePreviewDepositFallback({
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
  const isUnderlyingAsset = token !== asset
  const preview = useContractRead({
    ...useVaultContract(vaultAddress),
    enabled: !!asset && !isUnderlyingAsset && enabled,
    functionName: "previewDeposit",
    args: [BigInt(amount)],
  })

  const previewUnderlying = useCurvePreviewDepositUnderlying({
    asset,
    vaultAddress,
    token,
    amount,
    type,
    slippage,
    enabled: !!asset && isUnderlyingAsset && enabled,
  })

  if (isUnderlyingAsset) {
    return {
      ...previewUnderlying,
      data: {
        minAmountWei: BigInt(previewUnderlying?.data.minAmountWei).toString(),
        resultWei: BigInt(previewUnderlying?.data.resultWei).toString(),
      },
    }
  }

  return {
    ...preview,
    data: {
      minAmountWei: (preview.data ?? BigInt(0)).toString(),
      resultWei: (preview.data ?? BigInt(0)).toString(),
    },
  }
}