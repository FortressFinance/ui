import { useContractRead, useQuery } from "wagmi"

import { registryContractConfig } from "@/lib/fortressContracts"
import { fetchApiCurveCompounderPools } from "@/hooks/api/useApiCompounderPools"
import { VaultProps } from "@/hooks/types"
import useIsCurve from "@/hooks/useIsCurve"
import useIsTokenCompounder from "@/hooks/useIsTokenCompounder"

export default function useCompounderUnderlyingAssets({
  address,
  type,
}: VaultProps) {
  const isToken = useIsTokenCompounder(type)
  const isCurve = useIsCurve(type)

  // Preferred: API request
  const apiQuery = useQuery(["pools", type], {
    queryFn: () => fetchApiCurveCompounderPools({ isCurve: isCurve ?? true }),
    retry: false,
    enabled: !isToken,
  })
  // Fallback: contract request
  const registryQuery = useContractRead({
    ...registryContractConfig,
    functionName: isCurve
      ? "getCurveCompounderUnderlyingAssets"
      : "getBalancerCompounderUnderlyingAssets",
    args: [address],
    enabled: apiQuery.isError && !isToken,
  })

  if (isToken) {
    return {
      data: undefined,
      isLoading: false,
    }
  }

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
