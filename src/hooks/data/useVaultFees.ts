import { useContractRead } from "wagmi"

import {
  findApiCompounderVaultForAsset,
  findApiTokenVaultForAsset,
} from "@/lib/findApiVaultForAsset"
import { useApiListCompounderVaults, useApiListTokenVaults } from "@/hooks/api"
import { VaultProps } from "@/hooks/types"
import useIsTokenCompounder from "@/hooks/useIsTokenCompounder"

import curveCompounderAbi from "@/constant/abi/curveCompounderAbi"

// TODO: This should just use multicall to get all of the fees at once from the contract

export function useVaultPlatformFee({ asset, type }: VaultProps) {
  const isToken = useIsTokenCompounder(type)

  // Preferred: API request
  const apiCompounderQuery = useApiListCompounderVaults({ type })
  const apiTokenQuery = useApiListTokenVaults({ type })

  // Fallback: contract request
  const registryQuery = useContractRead({
    abi: curveCompounderAbi,
    address: asset,
    functionName: "platformFeePercentage",
    enabled: isToken ? apiTokenQuery.isError : apiCompounderQuery.isError,
    select: (data) => data.toString(),
  })

  // Prioritize API response until it has errored
  if (isToken && !apiTokenQuery.isError && apiTokenQuery.data !== null) {
    return {
      ...apiTokenQuery,
      data: findApiTokenVaultForAsset(apiTokenQuery.data, asset)?.platformFee,
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
        ?.platformFee,
    }
  }

  // Fallback to contract data after failure
  return registryQuery
}

export function useVaultWithdrawFee({ asset, type }: VaultProps) {
  const isToken = useIsTokenCompounder(type)

  // Preferred: API request
  const apiCompounderQuery = useApiListCompounderVaults({ type })
  const apiTokenQuery = useApiListTokenVaults({ type })

  // Fallback: contract request
  const registryQuery = useContractRead({
    abi: curveCompounderAbi,
    address: asset,
    functionName: "withdrawFeePercentage",
    enabled: isToken ? apiTokenQuery.isError : apiCompounderQuery.isError,
    select: (data) => data.toString(),
  })

  // Prioritize API response until it has errored
  if (isToken && !apiTokenQuery.isError && apiTokenQuery.data !== null) {
    return {
      ...apiTokenQuery,
      data: findApiTokenVaultForAsset(apiTokenQuery.data, asset)?.withdrawalFee,
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
        ?.withdrawalFee,
    }
  }

  // Fallback to contract data after failure
  return registryQuery
}
