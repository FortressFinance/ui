import { Address, useContractRead } from "wagmi"

import { VaultType } from "@/lib/types"
import useCompounderPreviewRedeemUnderlying from "@/hooks/lib/preview/compounder/useCompounderPreviewRedeemUnderlying"
import { useVaultContract } from "@/hooks/lib/useVaultContract"

export default function useCompounderPreviewRedeemFallback({
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
  const isUnderlyingToken = token !== asset
  const preview = useContractRead({
    ...useVaultContract(vaultAddress),
    enabled: !!asset && !isUnderlyingToken && enabled,
    functionName: "previewRedeem",
    args: [BigInt(amount)],
  })

  const previewUnderlying = useCompounderPreviewRedeemUnderlying({
    asset,
    token,
    amount,
    type,
    slippage,
    enabled: !!asset && isUnderlyingToken && enabled,
  })

  if (isUnderlyingToken) {
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
