import { useContractRead, useContractReads } from "wagmi"

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

export function useCompounder({ asset, type }: VaultProps) {
  const chainId = useActiveChainId()
  const isCurve = useIsCurveCompounder(type)
  const isToken = useIsTokenCompounder(type)

  // Preferred: API request
  const apiCompounderQuery = useApiCompounderVaults({ type })
  const apiTokenQuery = useApiTokenVaults({ type })

  // Fallback: contract requests
  const enableFallback = isToken
    ? apiTokenQuery.isError
    : apiCompounderQuery.isError
  const registryContract = useRegistryContract()
  const compounderInfo = useContractReads({
    contracts: [
      {
        ...registryContract,
        functionName: isToken
          ? "getTokenCompounderName"
          : isCurve
          ? "getCurveCompounderName"
          : "getBalancerCompounderName",
        args: [asset ?? "0x"],
      },
      {
        ...registryContract,
        functionName: isToken
          ? "getTokenCompounder"
          : isCurve
          ? "getCurveCompounder"
          : "getBalancerCompounder",
        args: [asset ?? "0x"],
      },
    ],
    enabled: !!asset && enableFallback,
  })
  const underlyingAssets = useContractRead({
    chainId,
    address: compounderInfo.data?.[1],
    abi: vaultCompounderAbi,
    functionName: "getUnderlyingAssets",
    enabled: enableFallback && !isToken && !!compounderInfo.data?.[1],
  })

  // Prioritize API response until it has errored
  if (isToken && !apiTokenQuery.isError) {
    const matchedCompounder = findApiTokenVaultForAsset(
      apiTokenQuery.data,
      asset
    )
    return {
      ...apiTokenQuery,
      data: {
        name: matchedCompounder?.vaultName,
        ybTokenAddress: matchedCompounder?.token.ybToken.address,
        underlyingAssetAddresses: matchedCompounder?.token.underlyingAssets
          .map((a) => a.address)
          .concat([matchedCompounder.token.baseAsset.address ?? "0x"]),
      },
    }
  }

  if (!isToken && !apiCompounderQuery.isError) {
    const matchedCompounder = findApiCompounderVaultForAsset(
      apiCompounderQuery.data,
      asset
    )
    return {
      ...apiCompounderQuery,
      data: {
        name: matchedCompounder?.poolName,
        ybTokenAddress: matchedCompounder?.token.ybToken.address,
        underlyingAssetAddresses: matchedCompounder?.token.assets.map(
          (a) => a.address
        ),
      },
    }
  }

  // Fallback to contract data after failure
  const queries = [compounderInfo, underlyingAssets]
  return {
    isError: queries.some((q) => q.isError),
    isLoading: queries.some((q) => q.isLoading),
    isFetching: queries.some((q) => q.isFetching),
    data: {
      name: compounderInfo.data?.[0],
      ybTokenAddress: compounderInfo.data?.[1],
      underlyingAssetAddresses:
        isToken && asset ? [asset] : underlyingAssets.data,
    },
  }
}
