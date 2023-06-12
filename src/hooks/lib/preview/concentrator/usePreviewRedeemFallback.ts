import { Address, useContractRead } from "wagmi"

import usePreviewRedeemUnderlying from "@/hooks/lib/preview/concentrator/usePreviewRedeemUnderlying"
import { useVaultContract } from "@/hooks/lib/useVaultContract"
import { useConcentratorVaultYbtokenAddress } from "@/hooks/useConcentratorVaultYbtokenAddress"

export default function usePreviewRedeemFallback({
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
    ...useVaultContract(ybTokenAddress),
    enabled: !isUnderlyingAsset && !!ybTokenAddress && enabled,
    functionName: "previewRedeem",
    args: [BigInt(amount)],
  })

  const previewUnderlying = usePreviewRedeemUnderlying({
    primaryAsset,
    token,
    amount,
    slippage,
    enabled: isUnderlyingAsset && !!ybTokenAddress && enabled,
  })

  if (isUnderlyingAsset) {
    return {
      ...previewUnderlying,
      data: {
        minAmountWei: BigInt(previewUnderlying?.data ?? 0).toString(),
        resultWei: BigInt(previewUnderlying?.data ?? 0).toString(),
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
