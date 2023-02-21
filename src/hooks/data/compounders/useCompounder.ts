import { useContractReads } from "wagmi"

import {
  findApiCompounderVaultForAsset,
  findApiTokenVaultForAsset,
} from "@/lib/findApiVaultForAsset"
import { VaultProps } from "@/lib/types"
import { useApiCompounderVaults, useApiTokenVaults } from "@/hooks/api"
import useRegistryContract from "@/hooks/useRegistryContract"
import {
  useIsCurveCompounder,
  useIsTokenCompounder,
} from "@/hooks/useVaultTypes"

export function useCompounder({ asset, type }: VaultProps) {
  // const chainId = useActiveChainId()
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
      {
        ...registryContract,
        functionName: isToken
          ? // dummy request that returns the same type of data
            "getTokenCompoundersList"
          : isCurve
          ? "getCurveCompounderUnderlyingAssets"
          : "getBalancerCompounderUnderlyingAssets",
        args: [asset ?? "0x"],
      },
    ],
    enabled: !!asset && enableFallback,
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
        name: matchedCompounder?.name,
        ybTokenAddress: matchedCompounder?.token.ybToken.address,
        underlyingAssetAddresses: matchedCompounder?.token.assets
          .map((a) => a.address)
          .concat([matchedCompounder.token.primaryAsset.address ?? "0x"]),
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
        name: matchedCompounder?.name,
        ybTokenAddress: matchedCompounder?.token.ybToken.address,
        underlyingAssetAddresses:
          matchedCompounder?.token.underlyingAssets?.map((a) => a.address),
      },
    }
  }

  // Fallback to contract data after failure
  return {
    ...compounderInfo,
    data: {
      name: compounderInfo.data?.[0],
      ybTokenAddress: compounderInfo.data?.[1],
      underlyingAssetAddresses: isToken
        ? asset
          ? [asset]
          : []
        : compounderInfo.data?.[2],
    },
  }
}
