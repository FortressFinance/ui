import { useCallback, useEffect, useState } from "react"
import { useContractRead, useQuery } from "wagmi"

import { registryContractConfig } from "@/lib/fortressContracts"
import {
  fetchApiCurveCompounderPools,
  fetchApiTokenCompounderPools,
} from "@/hooks/api/useApiCompounderPools"
import { VaultType } from "@/hooks/types"
import useIsCurve from "@/hooks/useIsCurve"
import useIsTokenCompounder from "@/hooks/useIsTokenCompounder"

export default function useCompounderPoolAddresses({
  type,
}: {
  type: VaultType
}) {
  const [functionName, setFunctionName] = useState("")
  const isCurve = useIsCurve(type)
  const isToken = useIsTokenCompounder(type)

  useEffect(() => {
    setFunctionName(
      isToken
        ? "getTokenCompoundersList"
        : isCurve
        ? "getCurveCompoundersList"
        : "getBalancerCompoundersList"
    )
  }, [isCurve, isToken])

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
    functionName: functionName,
    enabled: apiQuery.isError,
  })

  // Prioritize API response until it has errored
  if (!apiQuery.isError && apiQuery.data !== null) {
    return {
      ...apiQuery,
      data: !isToken
        ? apiQuery.data?.map((p) => p.token.LPtoken?.address)
        : apiQuery.data?.map((p) => p.token.asset.address),
    }
  }
  return registryQuery
}
