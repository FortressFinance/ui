import { useEffect, useState } from "react"
import { formatUnits } from "viem"
import { Address, useContractRead } from "wagmi"

import { getGlpPrice } from "@/lib/api/pricer/getGlpPrice"
import { useActiveChainId } from "@/hooks/useActiveChainId"
import { useTokenVaultSymbol } from "@/hooks/useTokenVaultSymbol"

import { GlpVault } from "@/constant/abi"
import { AMMCompounderBase } from "@/constant/abi"
import { ETH, glpVault } from "@/constant/addresses"

const WETH_ARBI: Address = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1"
const DAI_ARBI: Address = "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1"
const WBTC_ARBI: Address = "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f"
const LINK_ARBI: Address = "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4"
const UNI_ARBI: Address = "0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0"
const USDC_ARBI: Address = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8"
const USDT_ARBI: Address = "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9"
const FRAX_ARBI: Address = "0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F"

const MINT_BURN_FEE_BASIS_POINTS = 25
const TAX_BASIS_POINTS = 50
const BASIS_POINTS_DIVISOR = 10000

const decimals: { [key: Address]: number } = {
  [DAI_ARBI]: 18,
  [WBTC_ARBI]: 8,
  [WETH_ARBI]: 18,
  [LINK_ARBI]: 18,
  [UNI_ARBI]: 18,
  [USDC_ARBI]: 6,
  [USDT_ARBI]: 6,
  [FRAX_ARBI]: 18,
  [ETH]: 18,
}

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
  enabled?: boolean
}) {
  const { data: ybTokenSymbol } = useTokenVaultSymbol({
    asset,
    enabled,
  })

  const chainId = useActiveChainId()
  const isUnderlyingAsset = token !== asset

  const preview = useContractRead({
    chainId,
    abi: AMMCompounderBase,
    address: vaultAddress,
    enabled: !isUnderlyingAsset && ybTokenSymbol === "fcGLP" && enabled,
    functionName: "previewDeposit",
    args: [BigInt(amount)],
  })

  const previewUnderlying = useTokenPreviewDepositUnderlying({
    token,
    amount,
    slippage,
    enabled: isUnderlyingAsset && ybTokenSymbol === "fcGLP" && enabled,
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
          resultWei: (preview.data ?? 0n).toString(),
        },
      }
}

function useTokenPreviewDepositUnderlying({
  token = "0x",
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

  if (token == ETH) {
    token = WETH_ARBI
  }
  useEffect(() => {
    getGlpPrice().then((price) => setGlpPrice(price))
  }, [])

  const tokenPriceWei = useContractRead({
    chainId,
    abi: GlpVault,
    address: glpVault,
    enabled: isArbitrumFamily && enabled,
    functionName: "getMinPrice",
    args: [token],
  })

  const tokenPrice = formatUnits(tokenPriceWei.data ?? 0n, 30)
  const amountFormatted = formatUnits(BigInt(amount), decimals[token] ?? 18)
  const usdgAmount = Number(amountFormatted) * Number(tokenPrice)

  const feeBasisPoints = useContractRead({
    chainId,
    abi: GlpVault,
    address: glpVault,
    enabled: isArbitrumFamily && enabled,
    functionName: "getFeeBasisPoints",
    args: [
      token,
      BigInt(parseInt(usdgAmount.toFixed(2))),
      BigInt(MINT_BURN_FEE_BASIS_POINTS),
      BigInt(TAX_BASIS_POINTS),
      true,
    ],
  })

  const amountAfterFees =
    Number(amount) *
    10 ** (18 - decimals[token]) *
    ((BASIS_POINTS_DIVISOR - Number(feeBasisPoints.data ?? 0)) /
      BASIS_POINTS_DIVISOR)

  const mintAmount = amountAfterFees * Number(tokenPrice)
  const mint = mintAmount * (1 / glpPrice)
  const amountOut = !isArbitrumFamily ? 0 : mint

  const amountOutWithSlippage = Number(amountOut) * (1 + slippage)
  return {
    isLoading: false,
    isFetching: false,
    isSuccess: true,
    data: parseInt(
      amountOutWithSlippage.toLocaleString("fullwide", { useGrouping: false })
    ),
  }
}
