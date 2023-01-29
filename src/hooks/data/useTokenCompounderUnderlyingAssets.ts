import { useContractRead, useQuery } from "wagmi"

import { registryContractConfig } from "@/lib/fortressContracts"
import { fetchApiTokenCompounderPools } from "@/hooks/api/useApiCompounderPools"
import { VaultProps } from "@/hooks/types"

export default function useTokenCompounderUnderlyingAssets({
  address,
  type,
}: VaultProps) {
  // Preferred: API request
  const apiQuery = useQuery(["pools", type], {
    queryFn: () => fetchApiTokenCompounderPools(),
    retry: false,
  })
  // Fallback: contract request
  const registryQuery = useContractRead({
    ...registryContractConfig,
    functionName: "getTokenCompoundersList",
    enabled: apiQuery.isError,
  })
  // Prioritize API response until it has errored
  if (!apiQuery.isError && apiQuery.data !== null) {
    return {
      ...apiQuery,
      data: apiQuery.data?.find((p) => p.token.ybToken.address === address)
        ?.token.asset.address,
    }
  }
  // Fallback to contract data after failure
  return registryQuery
}
