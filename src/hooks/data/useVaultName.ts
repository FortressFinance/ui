import { useContractRead } from "wagmi"

import { VaultProps } from "@/lib/types"
import { useApiCompounderVaults, useApiTokenVaults } from "@/hooks/api"
import { useVaultTokens } from "@/hooks/data"
import useRegistryContract from "@/hooks/useRegistryContract"
import {
  useIsCurveCompounder,
  useIsTokenCompounder,
} from "@/hooks/useVaultTypes"

export default function useVaultName({ asset, type }: VaultProps) {
  const isCurve = useIsCurveCompounder(type)
  const isToken = useIsTokenCompounder(type)
  const { data: vaultTokens } = useVaultTokens({
    asset,
    type,
  })

  // Preferred: API request
  const apiCompounderQuery = useApiCompounderVaults({ type })
  const apiTokenQuery = useApiTokenVaults({ type })

  // Fallback: contract request
  const registryQuery = useContractRead({
    ...useRegistryContract(),
    functionName: isToken
      ? "getTokenCompounderName"
      : isCurve
      ? "getCurveCompounderName"
      : "getBalancerCompounderName",
    args: [asset ?? "0x"],
    enabled: apiCompounderQuery.isError || apiTokenQuery.isError,
  })
  // Prioritize API response until it has errored
  if (!apiCompounderQuery.isError && !isToken) {
    return {
      ...apiCompounderQuery,
      data: apiCompounderQuery.data?.find(
        (p) => p.token.ybToken.address === vaultTokens.ybTokenAddress
      )?.poolName,
    }
  }
  if (!apiTokenQuery.isError && isToken) {
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
