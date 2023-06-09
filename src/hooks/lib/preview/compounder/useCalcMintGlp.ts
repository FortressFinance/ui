import { useEffect, useState } from "react"
import { formatUnits } from "viem"
import { Address, useContractRead } from "wagmi"

import { getGlpPrice } from "@/lib/api/pricer/getGlpPrice"
import { useActiveChainId } from "@/hooks/useActiveChainId"

import { GlpVault } from "@/constant/abi"
import {
  DAI_ARBI,
  ETH,
  FRAX_ARBI,
  glpVault,
  LINK_ARBI,
  UNI_ARBI,
  USDC_ARBI,
  USDT_ARBI,
  WBTC_ARBI,
  WETH_ARBI,
} from "@/constant/addresses"

export default function useCalcMintGlp({
  amount,
  token,
  enabled,
}: {
  amount: string
  token: Address
  enabled: boolean
}) {
  const chainId = useActiveChainId()
  const isArbitrumFamily = chainId === 313371 || chainId === 42161

  if (token == ETH) {
    token = WETH_ARBI
  }

  const [glpPrice, setGlpPrice] = useState(0)

  useEffect(() => {
    getGlpPrice().then((price) => setGlpPrice(price))
  }, [])

  const tokenPriceWei = useContractRead({
    chainId,
    abi: GlpVault,
    address: glpVault,
    enabled: isArbitrumFamily && enabled,
    functionName: "getMinPrice",
    args: [token !== ETH ? token : WETH_ARBI],
  })

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

  const tokenPrice = formatUnits(tokenPriceWei.data ?? BigInt(0), 30)
  const usdgAmount =
    (Number(tokenPrice) * Number(amount)) / 10 ** (decimals[token] ?? 1)

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

  const amountAfterFees =
    Number(amount) *
    10 ** (18 - decimals[token]) *
    ((BASIS_POINTS_DIVISOR - Number(feeBasisPoints.data ?? 0)) /
      BASIS_POINTS_DIVISOR)

  if (!isArbitrumFamily) {
    return 0
  }

  return amountAfterFees * Number(tokenPrice) * (1 / glpPrice)
}
