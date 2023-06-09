import { Address, useContractRead } from "wagmi"

import useTokenPreviewDepositUnderlying from "@/hooks/lib/preview/compounder/useTokenPreviewDepositUnderlying"
import { useActiveChainId } from "@/hooks/useActiveChainId"
import { useTokenVaultSymbol } from "@/hooks/useTokenVaultSymbol"

import { GlpCompounder } from "@/constant/abi"

export default function useTokenPreviewDepositFallback({
  asset,
  vaultAddress,
  token,
  amount,
  slippage,
  enabled,
}: {
  asset: Address
  vaultAddress: Address
  token?: Address
  amount: string
  slippage: number
  enabled: boolean
}) {
  const tokenVaultSymbol = useTokenVaultSymbol({
    asset,
    enabled,
  })

  const ybTokenSymbol = tokenVaultSymbol.data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let abi: any = undefined
  if (ybTokenSymbol === "fcGLP") {
    abi = GlpCompounder
  }

  const chainId = useActiveChainId()
  const isUnderlyingAsset = token !== asset

  const preview = useContractRead({
    chainId,
    abi,
    address: vaultAddress,
    enabled: !isUnderlyingAsset && enabled,
    functionName: "previewDeposit",
    args: [BigInt(amount)],
  })

  const previewUnderlying = useTokenPreviewDepositUnderlying({
    token,
    amount,
    slippage,
    enabled: isUnderlyingAsset && enabled,
  })

  if (isUnderlyingAsset && ybTokenSymbol === "fcGLP") {
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
      minAmountWei: undefined,
      resultWei: (preview.data ?? BigInt(0)).toString(),
    },
  }
}
