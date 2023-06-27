import { useEffect, useState } from "react"
import { formatUnits } from "viem"
import { useContractRead } from "wagmi"

import { getApiPrice, useActiveChainId } from "@/hooks"
import { useGlpPrice } from "@/hooks/lib/pricer/useGlpPrice"

import { RewardDistributor } from "@/constant/abi"
import { ETH, glpRewardsDistributorAddress } from "@/constant/addresses"

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
  ethRewardsPerSecond = 0n,
  enabled,
}: {
  ethRewardsPerSecond?: bigint
  enabled?: boolean
}) {
  const [ethPrice, setEthPrice] = useState(0)
  useEffect(() => {
    async function fetchPrice() {
      const price = await getApiPrice({ asset: ETH })
      setEthPrice(price)
    }
    fetchPrice()
  }, [])

  const { aumInUsdg: aum, price: priceGmx } = useGlpPrice({ enabled })
  const ethRewardsAnnual = formatUnits(
    ethRewardsPerSecond * 3600n * 24n * 365n,
    18
  )

  const gmxRewardsMonthlyEmissionRate = 0 // need to know why is it zero
  const esGmxRewards = priceGmx * gmxRewardsMonthlyEmissionRate * 12
  const aprGmx = esGmxRewards / aum
  const aprEth = (Number(ethRewardsAnnual) * ethPrice) / aum
  const totalApr = aprGmx + aprEth
  return {
    GMXApr: aprGmx,
    ETHApr: aprEth,
    totalApr: totalApr,
  }
}
