import { useContractRead, useQuery } from "wagmi"

import { registryContractConfig } from "@/lib/fortressContracts"
import { fetchApiCompounderPools } from "@/hooks/api/useApiCompounderPools"
import { VaultType } from "@/hooks/types"
import useIsCurve from "@/hooks/useIsCurve"

export default function useCompounderPoolAddresses({
  type,
}: {
  type: VaultType
}) {
  const isCurve = useIsCurve(type)
  // Preferred: API request
  const apiQuery = useQuery(["pools", type], {
    queryFn: () => fetchApiCompounderPools({ isCurve }),
    retry: false,
  })
  // Fallback: contract request
  const registryQuery = useContractRead({
    ...registryContractConfig,
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
