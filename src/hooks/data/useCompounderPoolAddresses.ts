import { useCallback, useEffect, useRef } from "react"
import { useContractRead, useQuery } from "wagmi"

import { registryContractConfig } from "@/lib/fortressContracts"
import {
  fetchApiCurveCompounderPools,
  fetchApiTokenCompounderPools,
} from "@/hooks/api/useApiCompounderPools"
import { VaultType } from "@/hooks/types"
import useIsCurve from "@/hooks/useIsCurve"

export default function useCompounderPoolAddresses({
  type,
}: {
  type: VaultType
}) {
  const functionName = useRef("")
  const isCurve = useIsCurve(type)

  useEffect(() => {
    functionName.current =
      isCurve === undefined
        ? "getTokenCompoundersList"
        : isCurve
        ? "getCurveCompoundersList"
        : "getBalancerCompoundersList"
  }, [isCurve])

  const fetchApiCompounderPoolsAsync = useCallback(() => {
    if (isCurve === undefined) {
      return fetchApiTokenCompounderPools()
    }
    return fetchApiCurveCompounderPools({ isCurve })
  }, [isCurve])

  // Preferred: API request
  const apiQuery = useQuery(["pools", type], {
    queryFn: () => fetchApiCompounderPoolsAsync(),
    retry: false,
  })
  // Fallback: contract request
  const registryQuery = useContractRead({
    ...registryContractConfig,
    functionName: functionName.current,
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
