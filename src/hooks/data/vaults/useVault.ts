import {
  findApiCompounderVaultForAsset,
  findApiTokenVaultForAsset,
} from "@/lib/findApiVaultForAsset"
import { VaultProps } from "@/lib/types"
import { useApiCompounderVaults, useApiTokenVaults } from "@/hooks/api"
import { useVaultContract } from "@/hooks/contracts/useVaultContract"
import { useFallbackReads } from "@/hooks/util"

export function useVault({ asset, type, vaultAddress }: VaultProps) {
  const vaultContract = useVaultContract(vaultAddress)
  return useFallbackReads(
    {
      contracts: [
        { ...vaultContract, functionName: "name" },
        { ...vaultContract, functionName: "symbol" },
        { ...vaultContract, functionName: "decimals" },
        { ...vaultContract, functionName: "getUnderlyingAssets" },
      ],
      enabled: !!asset && !!vaultAddress,
      select: (data) => ({
        name: data[0],
        symbol: data[1],
        decimals: data[2],
        underlyingAssets: data[3],
      }),
    },
    []
  )

  // const apiCompoundersRequest = useApiCompounderVaults({ type })

  // const vaultContract = useVaultContract(vaultAddress)

  // const apiCompounderVault = useApiCompounderVault({ asset, type })
  // const apiTokenVault = useApiTokenVault({ asset, type })

  // const fallbackRequest = useFallbackReads(
  //   {
  //     contracts: [
  //       { ...vaultContract, functionName: "name" },
  //       { ...vaultContract, functionName: "symbol" },
  //       { ...vaultContract, functionName: "decimals" },
  //       { ...vaultContract, functionName: "getUnderlyingAssets" },
  //     ],
  //     enabled: !!asset && !!vaultAddress,
  //     select: (data) => ({
  //       name: data[0],
  //       symbol: data[1],
  //       decimals: data[2],
  //       underlyingAssets: data[3],
  //     }),
  //   },
  //   [apiCompoundersRequest, apiCompounderVault, apiTokenVault]
  // )

  // return apiCompounderVault.isEnabled && !apiCompounderVault.isError
  //   ? apiCompounderVault
  //   : apiTokenVault.isEnabled && !apiTokenVault.isError
  //   ? apiTokenVault
  //   : fallbackRequest
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
      underlyingAssets: matchedVault?.token.assets?.map((a) => a.address) ?? [],
    },
  }
}
