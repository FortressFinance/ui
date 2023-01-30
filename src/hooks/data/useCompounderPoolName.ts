import { useContractRead } from "wagmi"

import { registryContractConfig } from "@/lib/fortressContracts"
import useApiCompounderPools from "@/hooks/api/useApiCompounderPools"
import { VaultProps } from "@/hooks/types"
import useIsCurve from "@/hooks/useIsCurve"
import useIsTokenCompounder from "@/hooks/useIsTokenCompounder"

export default function useCompounderPoolName({ address, type }: VaultProps) {
  const isCurve = useIsCurve(type)
  const isToken = useIsTokenCompounder(type)

  // Preferred: API request
  const apiQuery = useApiCompounderPools({ type })
  // Fallback: contract request
  const registryQuery = useContractRead({
    ...registryContractConfig,
    functionName: isToken
      ? "getTokenCompounderName"
      : isCurve
      ? "getCurveCompounderName"
      : "getBalancerCompounderName",
    args: [address],
    enabled: apiQuery.isError,
  })
  // Prioritize API response until it has errored
  if (!apiQuery.isError && apiQuery.data !== null) {
    return {
      ...apiQuery,
      data: isToken
        ? apiQuery.data?.find((p) => p.token.ybToken.address === address)
            ?.vaultName
        : apiQuery.data?.find((p) => p.token.ybToken.address === address)
            ?.poolName,
    }
  }
  // Fallback to contract data after failure
  return registryQuery
}
