import { Address, useContractRead, useQuery } from "wagmi"

import { getFortGlpAprFallback } from "@/lib/api/vaults"
import { useActiveChainId } from "@/hooks"

import { RewardDistributor } from "@/constant/abi"
import { glpRewardsDistributorAddress } from "@/constant/addresses"

export default function useTokenGlpVault({
  asset,
  enabled,
}: {
  asset: Address
  enabled: boolean
}) {
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

  const ethRewardsPerSecond = glpQuery.data

  const fortGlpAprFallback = useQuery([chainId, asset, "fortGlpAprFallback"], {
    queryFn: () => getFortGlpAprFallback(ethRewardsPerSecond),
    retry: false,
    enabled: enabled && !!ethRewardsPerSecond,
  })

  return fortGlpAprFallback
}
