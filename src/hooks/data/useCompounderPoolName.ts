import { useContractRead } from "wagmi"

import useApiCompounderPools from "@/hooks/api/useApiCompounderPools"
import { VaultProps } from "@/hooks/types"
import useIsCurve from "@/hooks/useIsCurve"
import useRegistryContract from "@/hooks/useRegistryContract"

export default function useCompounderPoolName({ address, type }: VaultProps) {
  const isCurve = useIsCurve(type)
  // Preferred: API request
  const apiQuery = useApiCompounderPools({ type })
  // Fallback: contract request
  const registryQuery = useContractRead({
    ...useRegistryContract(),
    functionName: isCurve
      ? "getCurveCompounderName"
      : "getBalancerCompounderName",
    args: [address],
    enabled: apiQuery.isError,
  })
  // Prioritize API response until it has errored
  if (!apiQuery.isError && apiQuery.data !== null) {
    return {
      ...apiQuery,
      data: apiQuery.data?.find((p) => p.token.ybToken.address === address)
        ?.poolName,
    }
  }
  // Fallback to contract data after failure
  return registryQuery
}
