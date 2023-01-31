import { useContractRead } from "wagmi"

import { registryContractConfig } from "@/lib/fortressContracts"
import { useApiListCompounderVaults, useApiListTokenVaults } from "@/hooks/api"
import { VaultType } from "@/hooks/types"
import useIsCurve from "@/hooks/useIsCurve"
import useIsTokenCompounder from "@/hooks/useIsTokenCompounder"

// HARDCODE HERE AT THE MOMENT, THE BE SHOULD CLASSIFY THEM
const stableRelevant = ["0x616e8BfA43F920657B3497DBf40D6b1A02D4608d"]
const crypto = ["0x62B9c7356A2Dc64a1969e19C23e4f579F9810Aa7"]

export default function useListVaults({ type }: { type: VaultType }) {
  const isCurve = useIsCurve(type)
  const isToken = useIsTokenCompounder(type)

  // Preferred: API request
  const apiCompounderQuery = useApiListCompounderVaults({ type })
  const apiTokenQuery = useApiListTokenVaults({ type })

  // Fallback: contract request
  const registryQuery = useContractRead({
    ...registryContractConfig,
    functionName: isToken
      ? "getTokenCompoundersList"
      : isCurve
      ? "getCurveCompoundersList"
      : "getBalancerCompoundersList",
    enabled: true,
  })

  // Prioritize API response until it has errored
  if (
    !isToken &&
    !apiCompounderQuery.isError &&
    apiCompounderQuery.data !== null
  ) {
    return {
      ...apiCompounderQuery,
      data: apiCompounderQuery.data?.map((v) => v.token?.LPtoken.address),
    }
  }
  if (isToken && !apiTokenQuery.isError && apiTokenQuery.data !== null) {
    const filterTab =
      type === "stable"
        ? stableRelevant
        : type === "crypto"
        ? crypto
        : [...crypto, ...stableRelevant]
    return {
      ...apiTokenQuery,
      data: apiTokenQuery.data
        ?.map((v) => v.token?.asset.address)
        .filter((a) => filterTab.includes(a)),
    }
  }

  // Fallback to contract query
  return registryQuery
}
