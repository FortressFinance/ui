import { Address, useContractRead } from "wagmi"

import { VaultType } from "@/lib/types"
import useCurvePreviewRedeemUnderlying from "@/hooks/lib/preview/useCurvePreviewRedeemUnderlying"
import { useVaultContract } from "@/hooks/lib/useVaultContract"

export default function useCurvePreviewRedeemFallback({
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
    functionName: "previewRedeem",
    args: [BigInt(amount)],
  })

  const previewUnderlying = useCurvePreviewRedeemUnderlying({
    asset,
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
          minAmountWei: BigInt(previewUnderlying?.data ?? 0).toString(),
          resultWei: BigInt(previewUnderlying?.data ?? 0).toString(),
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
