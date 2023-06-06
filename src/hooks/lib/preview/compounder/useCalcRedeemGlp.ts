import { useEffect, useState } from "react"
import { Address, useContractRead } from "wagmi"

import { getGlpPrice } from "@/lib/api/pricer/getGlpPrice"
import { useActiveChainId } from "@/hooks/useActiveChainId"

import { GlpVault } from "@/constant/abi"
import { ETH, glpVault, WETH_ARBI } from "@/constant/addresses"

export default function useCalcRedeemGlp({
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

  if (!isArbitrumFamily) {
    return 0
  }

  return (
    Number(redemptionAmount.data ?? 0) *
    ((BASIS_POINTS_DIVISOR - Number(feeBasisPoints.data ?? 0)) /
      BASIS_POINTS_DIVISOR)
  )
}
