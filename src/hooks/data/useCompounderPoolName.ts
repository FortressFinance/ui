import { useContractRead } from "wagmi"

import { registryContractConfig } from "@/lib/fortressContracts"
import useApiCompounderPools from "@/hooks/api/useApiCompounderPools"
import { VaultProps } from "@/hooks/types"
import useIsCurve from "@/hooks/useIsCurve"
import { useEffect, useRef } from "react"

export default function useCompounderPoolName({ address, type }: VaultProps) {
  const functionName = useRef("")
  const fieldKey = useRef("")
  const isCurve = useIsCurve(type)

  useEffect(() => {
    functionName.current = !isCurve ? "getTokenCompounderName" : (isCurve
      ? "getCurveCompounderName"
      : "getBalancerCompounderName")
    fieldKey.current = !isCurve ? "poolName" : "vaultName"
  }, [isCurve])

  // Preferred: API request
  const apiQuery = useApiCompounderPools({ type })
  // Fallback: contract request
  const registryQuery = useContractRead({
    ...registryContractConfig,
    functionName: functionName.current,
    args: [address],
    enabled: apiQuery.isError,
  })
  // Prioritize API response until it has errored
  if (!apiQuery.isError && apiQuery.data !== null) {
    return {
      ...apiQuery,
      data: apiQuery.data?.find((p) => p.token.ybToken.address === address)
        ?.[fieldKey.current],
    }
  }
  // Fallback to contract data after failure
  return registryQuery
}

