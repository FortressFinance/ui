import { useContractRead } from "wagmi"

import useApiCompounderPools from "@/hooks/api/useApiCompounderPools"
import { VaultProps } from "@/hooks/types"
import useIsCurve from "@/hooks/useIsCurve"
import useRegistryContract from "@/hooks/useRegistryContract"

export default function useCompounderUnderlyingAssets({
  address,
  type,
}: VaultProps) {
  const isCurve = useIsCurve(type)
  // Preferred: API request
  const apiQuery = useApiCompounderPools({ type })
  // Fallback: contract request
  const registryQuery = useContractRead({
    ...useRegistryContract(),
    functionName: isCurve
      ? "getCurveCompounderUnderlyingAssets"
      : "getBalancerCompounderUnderlyingAssets",
    args: [address],
    enabled: apiQuery.isError,
  })

  // Prioritize API response until it has errored
  if (!apiQuery.isError && apiQuery.data !== null) {
    return {
      ...apiQuery,
      data: apiQuery.data
        ?.find((p) => p.token.ybToken.address === address)
        ?.token.assets.map((a) => a.address),
    }
  }
  // Fallback to contract data after failure
  return registryQuery
}

export type UseCompounderUnderlyingAssetsResult = ReturnType<
  typeof useCompounderUnderlyingAssets
>
