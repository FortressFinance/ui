import { Address, useContractRead } from "wagmi"

import usePreviewDepositUnderlying from "@/hooks/lib/preview/concentrator/usePreviewDepositUnderlying"
import { useConcentratorContract } from "@/hooks/lib/useConcentratorContract"
import { useConcentratorVaultYbtokenAddress } from "@/hooks/useConcentratorVaultYbtokenAddress"

export default function usePreviewDepositFallback({
  primaryAsset,
  targetAsset,
  token,
  amount,
  slippage,
  enabled,
}: {
  primaryAsset: Address
  targetAsset: Address
  token?: Address
  amount: string
  slippage: number
  enabled: boolean
}) {
  const isUnderlyingAsset = token !== primaryAsset

  const ybTokenAddress = useConcentratorVaultYbtokenAddress({
    targetAsset,
    primaryAsset,
    enabled,
  })

  const preview = useContractRead({
    ...useConcentratorContract(ybTokenAddress),
    enabled: !isUnderlyingAsset && !!ybTokenAddress && enabled,
    functionName: "previewDeposit",
    args: [BigInt(amount)],
  })

  const previewUnderlying = usePreviewDepositUnderlying({
    primaryAsset,
    ybTokenAddress,
    token,
    amount,
    slippage,
    enabled: isUnderlyingAsset && !!ybTokenAddress && enabled,
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
