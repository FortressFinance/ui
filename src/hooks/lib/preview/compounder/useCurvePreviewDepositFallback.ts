import { Address, useContractRead } from "wagmi"

import { VaultType } from "@/lib/types"
import useCurvePreviewDepositUnderlying from "@/hooks/lib/preview/useCurvePreviewDepositUnderlying"
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
  enabled?: boolean
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

  return isUnderlyingAsset
    ? {
        ...previewUnderlying,
        data: {
          minAmountWei: previewUnderlying?.data.minAmountWei.toString(),
          resultWei: previewUnderlying?.data.resultWei.toString(),
        },
      }
    : {
        ...preview,
        data: {
          minAmountWei: undefined,
          resultWei: preview.data?.toString() ?? "0",
        },
      }
}
