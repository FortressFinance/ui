import { useContractRead } from "wagmi"

import { VaultType } from "@/lib/types"
import { useApiCompounderVaults, useApiTokenVaults } from "@/hooks/api"
import useIsCurve from "@/hooks/useIsCurve"
import useIsTokenCompounder from "@/hooks/useIsTokenCompounder"
import useRegistryContract from "@/hooks/useRegistryContract"

// HARDCODE HERE AT THE MOMENT, THE BE SHOULD CLASSIFY THEM
const STABLE = ["0x62B9c7356A2Dc64a1969e19C23e4f579F9810Aa7"]
const CRYPTO = [
  "0x616e8BfA43F920657B3497DBf40D6b1A02D4608d",
  "0x5402B5F40310bDED796c7D0F3FF6683f5C0cFfdf",
]

export default function useVaultAddresses({ type }: { type: VaultType }) {
  const isCurve = useIsCurve(type)
  const isToken = useIsTokenCompounder(type)

  // Preferred: API request
  const apiCompounderQuery = useApiCompounderVaults({ type })
  const apiTokenQuery = useApiTokenVaults({ type })

  // Fallback: contract request
  const registryQuery = useContractRead({
    ...useRegistryContract(),
    functionName: isToken
      ? "getTokenCompoundersList"
      : isCurve
      ? "getCurveCompoundersList"
      : "getBalancerCompoundersList",
    enabled: apiCompounderQuery.isError || apiTokenQuery.isError,
  })

  // Prioritize API response until it has errored
  if (
    !apiCompounderQuery.isError &&
    apiCompounderQuery.data !== null &&
    !isToken
  ) {
    return {
      ...apiCompounderQuery,
      data: apiCompounderQuery.data?.map((p) => p.token.LPtoken?.address),
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
        ?.map((p) => p.token.baseAsset.address)
        .filter((a) => filterTab.includes(a)),
    }
  }
  const filterRegistryQuery = {
    ...registryQuery,
    data: registryQuery.data?.filter((a) => filterTab.includes(a)),
  }
  return filterRegistryQuery
}
