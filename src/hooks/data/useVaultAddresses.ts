import { useContractRead } from "wagmi"

import { VaultType } from "@/lib/types"
import { useApiCompounderVaults, useApiTokenVaults } from "@/hooks/api"
import useRegistryContract from "@/hooks/useRegistryContract"
import {
  useIsCurveCompounder,
  useIsTokenCompounder,
} from "@/hooks/useVaultTypes"

export default function useVaultAddresses({ type }: { type: VaultType }) {
  const isCurve = useIsCurveCompounder(type)
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
  if (!apiCompounderQuery.isError && !isToken) {
    return {
      ...apiCompounderQuery,
      data: apiCompounderQuery.data?.map((p) => p.token.primaryAsset?.address),
    }
  }

  if (!apiTokenQuery.isError && isToken) {
    return {
      ...apiTokenQuery,
      data: apiTokenQuery.data?.map((p) => p.token.primaryAsset.address),
    }
  }
  const filterRegistryQuery = {
    ...registryQuery,
    data: registryQuery.data,
  }
  return filterRegistryQuery
}
