import { useContractRead } from "wagmi"

import {
  findApiCompounderVaultForAsset,
  findApiTokenVaultForAsset,
} from "@/lib/findApiVaultForAsset"
import { VaultProps } from "@/lib/types"
import { useApiCompounderVaults, useApiTokenVaults } from "@/hooks/api"
import useActiveChainId from "@/hooks/useActiveChainId"
import useRegistryContract from "@/hooks/useRegistryContract"
import {
  useIsCurveCompounder,
  useIsTokenCompounder,
} from "@/hooks/useVaultTypes"

import { vaultCompounderAbi } from "@/constant/abi"

export default function useVaultTokens({ asset, type }: VaultProps) {
  // Preferred: API request
  const apiCompounderQuery = useApiCompounderVaults({ type })
  const apiTokenQuery = useApiTokenVaults({ type })

  // Fallback: contract requests
  const chainId = useActiveChainId()
  const isCurve = useIsCurveCompounder(type)
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
  const vaultGetUnderlying = useContractRead({
    chainId,
    address: regGetCompounder.data,
    abi: vaultCompounderAbi,
    functionName: "getUnderlyingAssets",
    enabled: enableFallback && !isToken && !!regGetCompounder.data,
  })

  // Prioritize API response until it has errored
  if (isToken && !apiTokenQuery.isError) {
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
  if (!isToken && !apiCompounderQuery.isError) {
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
  const queries = [regGetCompounder, vaultGetUnderlying]
  return {
    isError: queries.some((q) => q.isError),
    isLoading: queries.some((q) => q.isLoading),
    isFetching: queries.some((q) => q.isFetching),
    data: {
      ybTokenAddress: regGetCompounder.data,
      underlyingAssetAddresses:
        isToken && asset ? [asset] : vaultGetUnderlying.data,
    },
  }
}

export type UseVaultTokensResult = ReturnType<typeof useVaultTokens>
