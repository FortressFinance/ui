import { useContractRead, useQuery } from "wagmi"

import { registryContractConfig } from "@/lib/fortressContracts"
import { fetchApiTokenCompounderPools } from "@/hooks/api/useApiCompounderPools"
import { VaultProps } from "@/hooks/types"
import useIsTokenCompounder from "@/hooks/useIsTokenCompounder"

export default function useTokenCompounderUnderlyingAssets({
  address,
  type,
}: VaultProps) {
  const isToken = useIsTokenCompounder(type)

  // Preferred: API request
  const apiQuery = useQuery(["pools", type], {
    queryFn: () => fetchApiTokenCompounderPools(),
    retry: false,
  })
  // Fallback: contract request
  const registryQuery = useContractRead({
    ...registryContractConfig,
    functionName: "getTokenCompoundersList",
    enabled: apiQuery.isError && isToken,
  })

  if(!isToken){
    return {
      data: [undefined]
    }
  }
  // Prioritize API response until it has errored
  if (!apiQuery.isError && apiQuery.data !== null) {
    return {
      ...apiQuery,
      data: [apiQuery.data?.find((p) => p.token.ybToken.address === address)
        ?.token.asset.address],
    }
  }
  // Fallback to contract data after failure
  return registryQuery
}

export type UseTokenCompounderUnderlyingAssetsResult = ReturnType<
  typeof useTokenCompounderUnderlyingAssets
>
