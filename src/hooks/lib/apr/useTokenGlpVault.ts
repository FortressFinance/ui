import { useEffect, useState } from "react"
import { useContractRead } from "wagmi"

import { getApiPrice, useActiveChainId } from "@/hooks"
import { useGlpPrice } from "@/hooks/lib/pricer/useGlpPrice"

import { RewardDistributor } from "@/constant/abi"
import {
  ethTokenAddress,
  glpRewardsDistributorAddress,
} from "@/constant/addresses"

export default function useTokenGlpVault({ enabled }: { enabled?: boolean }) {
  let chainId = useActiveChainId()
  // force to get the latest tokensPerInterval in mainnet
  if (chainId === 313371) {
    chainId = 42161
  }
  const glpQuery = useContractRead({
    chainId,
    abi: RewardDistributor,
    address: glpRewardsDistributorAddress,
    functionName: "tokensPerInterval",
    enabled: enabled,
  })

  const result = useGetFortGlpAprFallback({
    ethRewardsPerSecond: glpQuery.data,
    enabled: enabled && !!glpQuery.data,
  })

  return {
    isLoading: false,
    data: result,
  }
}

export function useGetFortGlpAprFallback({
  ethRewardsPerSecond,
  enabled,
}: {
  ethRewardsPerSecond?: bigint
  enabled?: boolean
}) {
  const [ethPrice, setEthPrice] = useState(0)
  useEffect(() => {
    async function fetchPrice() {
      const price = await getApiPrice({ asset: ethTokenAddress })
      setEthPrice(price)
    }
    fetchPrice()
  }, [])

  const { aumInUsdg: aum, price: priceGmx } = useGlpPrice({ enabled })
  const ethRewardsAnnual =
    (Number(ethRewardsPerSecond ?? 0n) * 3600 * 24 * 365) / 1e18

  const gmxRewardsMonthlyEmissionRate = 0 // need to know why is it zero
  const esGmxRewards = priceGmx * gmxRewardsMonthlyEmissionRate * 12
  const aprGmx = esGmxRewards / aum
  const aprEth = (ethRewardsAnnual * ethPrice) / aum
  const totalApr = aprGmx + aprEth
  return {
    GMXApr: aprGmx,
    ETHApr: aprEth,
    totalApr: totalApr,
  }
}
