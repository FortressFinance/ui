import { useContractRead } from "wagmi"

import useApiCompounderPools from "@/hooks/api/useApiCompounderPools"
import { VaultProps } from "@/hooks/types"

import { selectActiveChainId, useActiveChain } from "@/store/activeChain"

import curveCompounderAbi from "@/constant/abi/curveCompounderAbi"

export default function useCompounderPlatformFeePercentage({
  address,
  type,
}: VaultProps) {
  const chainId = useActiveChain(selectActiveChainId)
  // Preferred: API request
  const apiQuery = useApiCompounderPools({ type })
  // Fallback: contract request
  const registryQuery = useContractRead({
    chainId,
    abi: curveCompounderAbi,
    address,
    functionName: "platformFeePercentage",
    enabled: apiQuery.isError,
    select: (data) => data.toString(),
  })
  // Prioritize API response until it has errored
  if (!apiQuery.isError && apiQuery.data !== null) {
    return {
      ...apiQuery,
      data: apiQuery.data?.find((p) => p.token.ybToken.address === address)
        ?.platformFee,
    }
  }
  // Fallback to contract data after failure
  return registryQuery
}
