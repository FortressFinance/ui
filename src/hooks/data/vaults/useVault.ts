import { Address } from "wagmi"

import {
  findApiCompounderVaultForAsset,
  findApiTokenVaultForAsset,
} from "@/lib/findApiVaultForAsset"
import { VaultProps } from "@/lib/types"
import { useApiCompounderVaults, useApiTokenVaults } from "@/hooks/api"
import useActiveChainId from "@/hooks/useActiveChainId"
import { useFallbackReads } from "@/hooks/util"

import { vaultCompounderAbi } from "@/constant/abi"

export function useVault({ asset, type, vaultAddress }: VaultProps) {
  const apiCompoundersRequest = useApiCompounderVaults({ type })

  const isToken = type === "token"
  const chainId = useActiveChainId()
  const contract = { chainId, address: vaultAddress, abi: vaultCompounderAbi }

  const apiCompounderVault = useApiCompounderVault({ asset, type })
  const apiTokenVault = useApiTokenVault({ asset, type })

  const fallbackRequest = useFallbackReads(
    {
      contracts: [
        { ...contract, functionName: "name" },
        { ...contract, functionName: "symbol" },
        { ...contract, functionName: "decimals" },
        {
          ...contract,
          functionName: isToken ? "name" : "getUnderlyingAssets",
        },
      ],
      enabled: !!asset && !!vaultAddress,
      select: (data) => ({
        name: data[0],
        symbol: data[1],
        decimals: data[2],
        underlyingAssets: isToken
          ? ([asset] as Address[])
          : (data[3] as Address[]),
      }),
    },
    [apiCompoundersRequest, apiCompounderVault, apiTokenVault]
  )

  return apiCompounderVault.isEnabled && !apiCompounderVault.isError
    ? apiCompounderVault
    : apiTokenVault.isEnabled && !apiTokenVault.isError
    ? apiTokenVault
    : fallbackRequest
}

export type UseVaultResult = ReturnType<typeof useVault>["data"]

function useApiCompounderVault({ asset, type }: VaultProps) {
  const compounderVaults = useApiCompounderVaults({ type })
  const matchedVault = findApiCompounderVaultForAsset(
    compounderVaults.data,
    asset
  )
  return {
    ...compounderVaults,
    isError:
      compounderVaults.isError || (compounderVaults.isSuccess && !matchedVault),
    data: {
      name: matchedVault?.name ?? "",
      symbol: matchedVault?.token.primaryAsset.symbol ?? "",
      decimals: matchedVault?.token.primaryAsset.decimals ?? 18,
      underlyingAssets:
        matchedVault?.token.underlyingAssets?.map((a) => a.address) ?? [],
    },
  }
}

function useApiTokenVault({ asset, type }: VaultProps) {
  const tokenVaults = useApiTokenVaults({ type })
  const matchedVault = findApiTokenVaultForAsset(tokenVaults.data, asset)
  return {
    ...tokenVaults,
    isError: tokenVaults.isError || (tokenVaults.isSuccess && !matchedVault),
    data: {
      name: matchedVault?.name ?? "",
      symbol: matchedVault?.token.primaryAsset.symbol ?? "",
      decimals: matchedVault?.token.primaryAsset.decimals ?? 18,
      underlyingAssets: [
        ...(matchedVault?.token.assets?.map((a) => a.address) ?? []),
        asset,
      ] as Address[],
    },
  }
}
