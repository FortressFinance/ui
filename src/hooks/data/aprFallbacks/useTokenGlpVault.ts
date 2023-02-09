import { useContractRead, useQuery } from "wagmi"

import { getFortGlpAprFallback } from "@/lib/aprFallback"
import { VaultDynamicProps } from "@/lib/types"
import useActiveChainId from "@/hooks/useActiveChainId"

import glpRewardsDistributorAbi from "@/constant/abi/glpRewardsDistributorAbi"
import { GLP_REWARDS_DISTRIBUTOR_ADDRESS } from "@/constant/env"

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
    abi: glpRewardsDistributorAbi,
    address: GLP_REWARDS_DISTRIBUTOR_ADDRESS as `0x${string}`,
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
