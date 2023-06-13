import { useEffect, useState } from "react"
import { Address, useContractRead } from "wagmi"

import { getGlpPrice } from "@/lib/api/pricer/getGlpPrice"
import { useActiveChainId } from "@/hooks/useActiveChainId"
import { useTokenVaultSymbol } from "@/hooks/useTokenVaultSymbol"

import { AMMCompounderBase, GlpVault } from "@/constant/abi"
import { ETH, glpVault } from "@/constant/addresses"

const WETH_ARBI: Address = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1"

export default function useTokenPreviewRedeemFallback({
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
  enabled?: boolean
}) {
  const tokenVaultSymbol = useTokenVaultSymbol({
    asset,
    enabled,
  })

  const ybTokenSymbol = tokenVaultSymbol.data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let abi: any = undefined
  if (ybTokenSymbol === "fcGLP") {
    abi = AMMCompounderBase
  }

  const chainId = useActiveChainId()
  const isUnderlyingAsset = token !== asset

  const preview = useContractRead({
    chainId,
    abi,
    address: vaultAddress,
    enabled: !isUnderlyingAsset && enabled,
    functionName: "previewRedeem",
    args: [BigInt(amount)],
  })

  const previewUnderlying = useTokenPreviewRedeemUnderlying({
    token,
    amount,
    slippage,
    enabled: isUnderlyingAsset && enabled,
  })

  return isUnderlyingAsset && ybTokenSymbol === "fcGLP"
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
          minAmountWei: undefined,
          resultWei: (preview.data ?? BigInt(0)).toString(),
        },
      }
}

function useTokenPreviewRedeemUnderlying({
  token,
  amount,
  slippage,
  enabled,
}: {
  token?: Address
  amount: string
  slippage: number
  enabled?: boolean
}) {
  const chainId = useActiveChainId()
  const isArbitrumFamily = chainId === 313371 || chainId === 42161
  const [glpPrice, setGlpPrice] = useState(0)

  token = token ?? "0x"
  if (token == ETH) {
    token = WETH_ARBI
  }

  useEffect(() => {
    getGlpPrice().then((price) => setGlpPrice(price))
  }, [])

  const usdgAmount = Number(amount) * glpPrice
  const redemptionAmount = useContractRead({
    chainId,
    abi: GlpVault,
    address: glpVault,
    enabled: isArbitrumFamily && enabled,
    functionName: "getRedemptionAmount",
    args: [token, BigInt(usdgAmount)],
  })

  const MINT_BURN_FEE_BASIS_POINTS = 25
  const TAX_BASIS_POINTS = 50
  const BASIS_POINTS_DIVISOR = 10000

  const feeBasisPoints = useContractRead({
    chainId,
    abi: GlpVault,
    address: glpVault,
    enabled: isArbitrumFamily && enabled,
    functionName: "getFeeBasisPoints",
    args: [
      token,
      BigInt(usdgAmount),
      BigInt(MINT_BURN_FEE_BASIS_POINTS),
      BigInt(TAX_BASIS_POINTS),
      false,
    ],
  })

  const amountOut = !isArbitrumFamily
    ? 0
    : Number(redemptionAmount.data ?? 0) *
      ((BASIS_POINTS_DIVISOR - Number(feeBasisPoints.data ?? 0)) /
        BASIS_POINTS_DIVISOR)

  const amountOutWithSlippage = Number(amountOut) * (1 + slippage)
  return {
    isLoading: false,
    isFetching: false,
    isSuccess: true,
    data: parseInt(amountOutWithSlippage.toFixed(2)),
  }
}
