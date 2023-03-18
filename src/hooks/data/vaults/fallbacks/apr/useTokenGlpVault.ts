import { useContractRead, useQuery } from "wagmi"

import { getFortGlpAprFallback } from "@/lib/api/vaults"
import { VaultDynamicProps } from "@/lib/types"
import useActiveChainId from "@/hooks/useActiveChainId"

import { RewardDistributor } from "@/constant/abi"
import { glpRewardsDistributorAddress } from "@/constant/addresses"

export default function useTokenGlpVault({
  asset,
  enabled,
}: {
  asset: VaultDynamicProps["asset"]
  enabled: boolean
}) {
  const chainId = useActiveChainId()
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
