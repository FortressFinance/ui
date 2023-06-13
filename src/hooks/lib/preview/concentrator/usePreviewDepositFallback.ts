import { Address, useContractRead } from "wagmi"

import useCurvePreviewDeposit from "@/hooks/lib/preview/useCurvePreviewDepositUnderlying"
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

  const previewUnderlying = useCurvePreviewDeposit({
    asset: primaryAsset,
    vaultAddress: ybTokenAddress,
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
          minAmountWei: BigInt(previewUnderlying?.data.minAmountWei).toString(),
          resultWei: BigInt(previewUnderlying?.data.resultWei).toString(),
        },
      }
    : {
        ...preview,
        data: {
          minAmountWei: (preview.data ?? BigInt(0)).toString(),
          resultWei: (preview.data ?? BigInt(0)).toString(),
        },
      }
}
