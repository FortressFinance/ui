import { useContractRead } from "wagmi"

import {
  findApiCompounderVaultForAsset,
  findApiTokenVaultForAsset,
} from "@/lib/findApiVaultForAsset"
import { VaultProps } from "@/lib/types"
import { useApiCompounderVaults, useApiTokenVaults } from "@/hooks/api"
import useIsCurve from "@/hooks/useIsCurve"
import useIsTokenCompounder from "@/hooks/useIsTokenCompounder"
import useRegistryContract from "@/hooks/useRegistryContract"

export default function useVaultTokens({ asset, type }: VaultProps) {
  // Preferred: API request
  const apiCompounderQuery = useApiCompounderVaults({ type })
  const apiTokenQuery = useApiTokenVaults({ type })

  // Fallback: contract requests
  const isCurve = useIsCurve(type)
  const isToken = useIsTokenCompounder(type)
  const enableFallback = isToken
    ? apiTokenQuery.isError
    : apiCompounderQuery.isError

  const regGetCompounder = useContractRead({
    ...useRegistryContract(),
    functionName: isToken
      ? "getTokenCompounder"
      : isCurve
      ? "getCurveCompounder"
      : "getBalancerCompounder",
    args: [asset ?? "0x"],
    enabled: enableFallback,
  })
  const regGetUnderlying = useContractRead({
    ...useRegistryContract(),
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
        underlyingAssetAddresses: matchedVault?.token.underlyingAssets
          .map((a) => a.address)
          .concat([matchedVault?.token.baseAsset.address ?? "0x"]),
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
