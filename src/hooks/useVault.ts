import { Address, useContractReads } from "wagmi"

import {
  findApiCompounderVaultForAsset,
  findApiTokenVaultForAsset,
} from "@/lib/findApiVaultForAsset"
import { VaultProps } from "@/lib/types"
import { useApiCompounderVaults } from "@/hooks/lib/api/useApiCompounderVaults"
import { useApiTokenVaults } from "@/hooks/lib/api/useApiTokenVaults"
import { useVaultContract } from "@/hooks/lib/useVaultContract"

export function useVault({
  asset,
  vaultAddress,
}: {
  asset: Address
  vaultAddress: Address
}) {
  const vaultContract = useVaultContract(vaultAddress)
  return useContractReads({
    contracts: [
      { ...vaultContract, functionName: "name" },
      { ...vaultContract, functionName: "symbol" },
      { ...vaultContract, functionName: "decimals" },
      { ...vaultContract, functionName: "getUnderlyingAssets" },
    ],
    enabled: !!asset && !!vaultAddress,
    select: ([name, symbol, decimals, underlyingAssets]) => ({
      name: name.result,
      symbol: symbol.result,
      decimals: decimals.result,
      underlyingAssets: underlyingAssets.result,
    }),
  })
}

export type UseVaultResult = ReturnType<typeof useVault>["data"]

function _useApiCompounderVault({ asset, type }: VaultProps) {
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

function _useApiTokenVault({ asset, type }: VaultProps) {
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
