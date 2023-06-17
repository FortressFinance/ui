import { Address, useContractRead } from "wagmi"

import useCurvePreviewRedeem from "@/hooks/lib/preview/useCurvePreviewRedeemUnderlying"
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
  enabled?: boolean
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

  const previewUnderlying = useCurvePreviewRedeem({
    asset: primaryAsset,
    token,
    amount,
    type: "curve",
    slippage,
    enabled: isUnderlyingAsset && !!ybTokenAddress && enabled,
  })

  return isUnderlyingAsset
    ? {
        ...previewUnderlying,
        data: {
          minAmountWei: BigInt(previewUnderlying?.data ?? 0).toString(),
          resultWei: BigInt(previewUnderlying?.data ?? 0).toString(),
        },
      }
    : {
        ...preview,
        data: {
          minAmountWei: (preview.data ?? 0n).toString(),
          resultWei: (preview.data ?? 0n).toString(),
        },
      }
}
