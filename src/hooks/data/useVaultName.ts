import { useContractRead } from "wagmi"

import {
  findApiCompounderVaultForAsset,
  findApiTokenVaultForAsset,
} from "@/lib/findApiVaultForAsset"
import { registryContractConfig } from "@/lib/fortressContracts"
import { useApiListCompounderVaults, useApiListTokenVaults } from "@/hooks/api"
import { VaultProps } from "@/hooks/types"
import useIsCurve from "@/hooks/useIsCurve"
import useIsTokenCompounder from "@/hooks/useIsTokenCompounder"

export default function useVaultName({ asset, type }: VaultProps) {
  // Preferred: API request
  const apiCompounderQuery = useApiListCompounderVaults({ type })
  const apiTokenQuery = useApiListTokenVaults({ type })

  // Fallback: contract request
  const isCurve = useIsCurve(type)
  const isToken = useIsTokenCompounder(type)
  const registryQuery = useContractRead({
    ...registryContractConfig,
    functionName: isToken
      ? "getTokenCompounderName"
      : isCurve
      ? "getCurveCompounderName"
      : "getBalancerCompounderName",
    args: [asset ?? "0x"],
    enabled: true,
  })

  // Prioritize API response until it has errored
  if (isToken && !apiTokenQuery.isError && apiTokenQuery.data !== null) {
    return {
      ...apiTokenQuery,
      data: findApiTokenVaultForAsset(apiTokenQuery.data, asset)?.vaultName,
    }
  }
  if (
    !isToken &&
    !apiCompounderQuery.isError &&
    apiCompounderQuery.data !== null
  ) {
    return {
      ...apiCompounderQuery,
      data: findApiCompounderVaultForAsset(apiCompounderQuery.data, asset)
        ?.poolName,
    }
  }

  // Fallback to contract data after failure
  return registryQuery
}
