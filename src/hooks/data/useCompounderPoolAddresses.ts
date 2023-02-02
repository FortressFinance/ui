import { useContractRead, useQuery } from "wagmi"

import {
  fetchApiCurveCompounderPools,
  fetchApiTokenCompounderPools,
} from "@/hooks/api/useApiCompounderPools"
import { VaultType } from "@/hooks/types"
import useActiveChainId from "@/hooks/useActiveChainId"
import useIsCurve from "@/hooks/useIsCurve"
import useIsTokenCompounder from "@/hooks/useIsTokenCompounder"
import useRegistryContract from "@/hooks/useRegistryContract"

// HARDCODE HERE AT THE MOMENT, THE BE SHOULD CLASSIFY THEM
const STABLE = ["0x62B9c7356A2Dc64a1969e19C23e4f579F9810Aa7"]
const CRYPTO = ["0x616e8BfA43F920657B3497DBf40D6b1A02D4608d"]

export default function useCompounderPoolAddresses({
  type,
}: {
  type: VaultType
}) {
  const chainId = useActiveChainId()
  const isCurve = useIsCurve(type)
  const isToken = useIsTokenCompounder(type)

  // Preferred: API request
  const apiQuery = useQuery([chainId, "pools", type], {
    queryFn: () =>
      fetchApiCurveCompounderPools({ chainId, isCurve: isCurve ?? true }),
    retry: false,
    enabled: !isToken,
  })

  const apiTokenQuery = useQuery([chainId, "pools", type], {
    queryFn: () => fetchApiTokenCompounderPools({ chainId }),
    retry: false,
    enabled: isToken,
  })

  // Fallback: contract request
  const registryQuery = useContractRead({
    ...useRegistryContract(),
    functionName: isToken
      ? "getTokenCompoundersList"
      : isCurve
      ? "getCurveCompoundersList"
      : "getBalancerCompoundersList",
    enabled: apiQuery.isError || apiTokenQuery.isError,
  })

  // Prioritize API response until it has errored
  if (!apiQuery.isError && apiQuery.data !== null && !isToken) {
    return {
      ...apiQuery,
      data: apiQuery.data?.map((p) => p.token.LPtoken?.address),
    }
  }

  const filterTab =
    type === "stable"
      ? STABLE
      : type === "crypto"
      ? CRYPTO
      : [...CRYPTO, ...STABLE]

  if (!apiTokenQuery.isError && apiTokenQuery.data !== null && isToken) {
    return {
      ...apiTokenQuery,
      data: apiTokenQuery.data
        ?.map((p) => p.token.asset.address)
        .filter((a) => filterTab.includes(a)),
    }
  }
  const filterRegistryQuery = {
    ...registryQuery,
    data: registryQuery.data?.filter((a) => filterTab.includes(a)),
  }
  return filterRegistryQuery
}
