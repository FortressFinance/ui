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

export default function useVaultTokens({ asset, type }: VaultProps) {
  // Preferred: API request
  const apiCompounderQuery = useApiListCompounderVaults({ type })
  const apiTokenQuery = useApiListTokenVaults({ type })

  // Fallback: contract requests
  const isCurve = useIsCurve(type)
  const isToken = useIsTokenCompounder(type)
  const enableFallback = isToken
    ? apiTokenQuery.isError
    : apiCompounderQuery.isError

  const regGetCompounder = useContractRead({
    ...registryContractConfig,
    functionName: isToken
      ? "getTokenCompounder"
      : isCurve
      ? "getCurveCompounder"
      : "getBalancerCompounder",
    args: [asset ?? "0x"],
    enabled: enableFallback,
  })
  const regGetUnderlying = useContractRead({
    ...registryContractConfig,
    functionName: isToken
      ? "getTokenCompoundersList"
      : isCurve
      ? "getCurveCompounderUnderlyingAssets"
      : "getBalancerCompounderUnderlyingAssets",
    args: [regGetCompounder.data ?? "0x"],
    enabled: enableFallback && !!regGetCompounder.data,
  })

  // Prioritize API response until it has errored
  if (isToken && !apiTokenQuery.isError && apiTokenQuery.data !== null) {
    const matchedVault = findApiTokenVaultForAsset(apiTokenQuery.data, asset)
    return {
      ...apiTokenQuery,
      data: {
        ybTokenAddress: matchedVault?.token.ybToken.address,
        underlyingAssetAddresses: [matchedVault?.token.asset.address ?? "0x"],
      },
    }
  }
  if (
    !isToken &&
    !apiCompounderQuery.isError &&
    apiCompounderQuery.data !== null
  ) {
    const matchedVault = findApiCompounderVaultForAsset(
      apiCompounderQuery.data,
      asset
    )
    return {
      ...apiCompounderQuery,
      data: {
        ybTokenAddress: matchedVault?.token.ybToken.address,
        underlyingAssetAddresses: matchedVault?.token.assets.map(
          (a) => a.address
        ),
      },
    }
  }

  // Fallback to contract data after failure
  const queries = [regGetCompounder, regGetUnderlying]
  return {
    isError: queries.some((q) => q.isError),
    isLoading: queries.some((q) => q.isLoading),
    isFetching: queries.some((q) => q.isFetching),
    data: {
      ybTokenAddress: regGetCompounder.data,
      underlyingAssetAddresses: regGetUnderlying.data,
    },
  }
}

export type UseVaultTokensResult = ReturnType<typeof useVaultTokens>