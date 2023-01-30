import { useCallback } from "react"
import { useContractRead, useQuery } from "wagmi"

import { registryContractConfig } from "@/lib/fortressContracts"
import {
  fetchApiCurveCompounderPools,
  fetchApiTokenCompounderPools,
} from "@/hooks/api/useApiCompounderPools"
import { VaultProps } from "@/hooks/types"
import useIsCurve from "@/hooks/useIsCurve"
import useIsTokenCompounder from "@/hooks/useIsTokenCompounder"

export default function useCompounderYbTokens({ address, type }: VaultProps) {
  const isCurve = useIsCurve(type)
  const isToken = useIsTokenCompounder(type)

  const fetchApiCompounderPoolsAsync = useCallback(() => {
    if (isToken) {
      return fetchApiTokenCompounderPools()
    }
    return fetchApiCurveCompounderPools({ isCurve })
  }, [isCurve, isToken])

  // Preferred: API request
  const apiQuery = useQuery(["pools", type], {
    queryFn: () => fetchApiCompounderPoolsAsync(),
    retry: false,
  })

  // Fallback: contract request
  const registryQuery = useContractRead({
    ...registryContractConfig,
    functionName: isToken
      ? "getTokenCompounder"
      : isCurve
      ? "getCurveCompounder"
      : "getBalancerCompounder",
    args: [address],
    enabled: apiQuery.isError,
  })

  // Prioritize API response until it has errored
  if (!apiQuery.isError && apiQuery.data !== null) {
    return {
      ...apiQuery,
      data: isToken
        ? apiQuery.data?.find((p) => p.token.asset?.address === address)?.token
            .ybToken.address
        : apiQuery.data?.find((p) => p.token.LPtoken?.address === address)
            ?.token.ybToken.address,
    }
  }

  return registryQuery
}
