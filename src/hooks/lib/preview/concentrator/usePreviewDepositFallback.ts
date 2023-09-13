import { Address, useContractRead } from "wagmi"

import useCurvePreviewDepositUnderlying from "@/hooks/lib/preview/useCurvePreviewDepositUnderlying"
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
  enabled?: boolean
}) {
  const isUnderlyingAsset = token !== primaryAsset

  const ybTokenAddress = useConcentratorVaultYbtokenAddress({
    targetAsset,
    primaryAsset,
    enabled,
  })

  const preview = useContractRead({
    ...useConcentratorContract(ybTokenAddress ?? "0x"),
    enabled: !isUnderlyingAsset && ybTokenAddress !== "0x" && enabled,
    functionName: "previewDeposit",
    args: [BigInt(amount)],
  })

  const previewUnderlying = useCurvePreviewDepositUnderlying({
    asset: primaryAsset,
    vaultAddress: ybTokenAddress ?? "0x",
    token,
    amount,
    type: "curve",
    slippage,
    enabled: isUnderlyingAsset && ybTokenAddress !== "0x" && enabled,
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
          minAmountWei: (preview.data ?? 0n).toString(),
          resultWei: (preview.data ?? 0n).toString(),
        },
      }
}
