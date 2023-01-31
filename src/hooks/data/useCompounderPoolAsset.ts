import { useContractRead, useQuery } from "wagmi"

import { fetchApiCurveCompounderPools, fetchApiTokenCompounderPools } from "@/hooks/api/useApiCompounderPools"
import { VaultProps } from "@/hooks/types"
import useIsCurve from "@/hooks/useIsCurve"
import useIsTokenCompounder from "@/hooks/useIsTokenCompounder"

import curveCompounderAbi from "@/constant/abi/curveCompounderAbi"

export default function useCompounderPoolAsset({ address, type }: VaultProps) {
  const isCurve = useIsCurve(type)
  const isToken = useIsTokenCompounder(type)
  // Preferred: API request
  const apiQuery = useQuery(["pools", type], {
    queryFn: () => fetchApiCurveCompounderPools({ isCurve: isCurve?? true }),
    retry: false,
    enabled: !isToken
  })

  const apiTokenQuery = useQuery(["pools", type], {
    queryFn: () => fetchApiTokenCompounderPools(),
    retry: false,
    enabled: isToken
  })
  // Fallback: contract request
  const contractQuery = useContractRead({
    abi: curveCompounderAbi,
    functionName: "asset",
    address,
    enabled: apiQuery.isError,
  })
  // Prioritize API response until it has errored
  if (!apiQuery.isError && apiQuery.data !== null && !isToken) {
    return {
      ...apiQuery,
      data: apiQuery.data?.find((p) => p.token.ybToken.address === address)?.token
            .LPtoken.address,
    }
  }
  if (!apiTokenQuery.isError && apiTokenQuery.data !== null && isToken) {
    return {
      ...apiTokenQuery,
      data: apiTokenQuery.data?.find((p) => p.token.ybToken.address === address)?.token
            .asset.address,
    }
  }
  // Fallback to contract data after failure
  return contractQuery
}
