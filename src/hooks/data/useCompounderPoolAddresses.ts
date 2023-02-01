import { useChainId, useContractRead, useQuery } from "wagmi"

import { fetchApiCompounderPools } from "@/hooks/api/useApiCompounderPools"
import { VaultType } from "@/hooks/types"
import useIsCurve from "@/hooks/useIsCurve"
import useRegistryContract from "@/hooks/useRegistryContract"

export default function useCompounderPoolAddresses({
  type,
}: {
  type: VaultType
}) {
  const isCurve = useIsCurve(type)
  const chainId = useChainId()
  // Preferred: API request
  const apiQuery = useQuery([chainId, "pools", type], {
    queryFn: () => fetchApiCompounderPools({ chainId, isCurve }),
    retry: false,
  })
  // Fallback: contract request
  const registryQuery = useContractRead({
    ...useRegistryContract(),
    functionName: isCurve
      ? "getCurveCompoundersList"
      : "getBalancerCompoundersList",
    enabled: apiQuery.isError,
  })
  // Prioritize API response until it has errored
  if (!apiQuery.isError && apiQuery.data !== null) {
    return {
      ...apiQuery,
      data: apiQuery.data?.map((p) => p.token.ybToken.address),
    }
  }
  // Fallback to contract data after failure
  return registryQuery
}
