import { useContractRead, useQuery } from "wagmi"

import {
  fetchApiCurveCompounderPools,
  fetchApiTokenCompounderPools,
} from "@/hooks/api/useApiCompounderPools"
import useVaultTokens from "@/hooks/data/useVaultTokens"
import { VaultProps } from "@/hooks/types"
import useActiveChainId from "@/hooks/useActiveChainId"
import useIsCurve from "@/hooks/useIsCurve"
import useIsTokenCompounder from "@/hooks/useIsTokenCompounder"
import useRegistryContract from "@/hooks/useRegistryContract"

export default function useCompounderPoolName({ asset, type }: VaultProps) {
  const chainId = useActiveChainId()
  const isCurve = useIsCurve(type)
  const isToken = useIsTokenCompounder(type)
  const { data: vaultTokens } = useVaultTokens({
    asset,
    type,
  })

  // Preferred: API request
  const apiQuery = useQuery(["pools", type], {
    queryFn: () =>
      fetchApiCurveCompounderPools({ chainId, isCurve: isCurve ?? true }),
    retry: false,
    enabled: !isToken,
  })

  const apiTokenQuery = useQuery(["pools", type], {
    queryFn: () => fetchApiTokenCompounderPools({ chainId }),
    retry: false,
    enabled: isToken,
  })

  // Fallback: contract request
  const registryQuery = useContractRead({
    ...useRegistryContract(),
    functionName: isToken
      ? "getTokenCompounderName"
      : isCurve
      ? "getCurveCompounderName"
      : "getBalancerCompounderName",
    args: [asset ?? "0x"],
    enabled: apiQuery.isError || apiTokenQuery.isError,
  })
  // Prioritize API response until it has errored
  if (!apiQuery.isError && apiQuery.data !== null && !isToken) {
    return {
      ...apiQuery,
      data: apiQuery.data?.find(
        (p) => p.token.ybToken.address === vaultTokens.ybTokenAddress
      )?.poolName,
    }
  }
  if (!apiTokenQuery.isError && apiTokenQuery.data !== null && isToken) {
    return {
      ...apiTokenQuery,
      data: apiTokenQuery.data?.find(
        (p) => p.token.ybToken.address === vaultTokens.ybTokenAddress
      )?.vaultName,
    }
  }
  // Fallback to contract data after failure
  return registryQuery
}
