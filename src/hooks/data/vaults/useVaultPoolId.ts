import {
  findApiCompounderVaultForAsset,
  findApiTokenVaultForAsset,
} from "@/lib/findApiVaultForAsset"
import { VaultProps } from "@/lib/types"
import { useApiCompounderVaults, useApiTokenVaults } from "@/hooks/api"
import { useListCompounders } from "@/hooks/data/compounders"
import { useIsTokenCompounder } from "@/hooks/useVaultTypes"

// TODO: Support Concentrator vaults

export function useVaultPoolId({ asset, type }: VaultProps) {
  const isToken = useIsTokenCompounder(type)

  // Preferred: API request
  const apiCompounderQuery = useApiCompounderVaults({ type })
  const apiTokenQuery = useApiTokenVaults({ type })

  const primaryAssets = useListCompounders()

  if (!isToken) {
    const matchedVault = findApiCompounderVaultForAsset(
      apiCompounderQuery.data,
      asset
    )

    if(matchedVault === undefined 
      && primaryAssets !== undefined 
      && primaryAssets.data !== undefined 
      && primaryAssets.data?.length > 0){
      const relevantPrimaryAssets = primaryAssets.data.filter(pa => pa.vaultType === type)
      const index = relevantPrimaryAssets?.findIndex((v) => v.vaultAssetAddress === asset)
      return {
        ...apiCompounderQuery,
        data: index,
      }
    }

    return {
      ...apiCompounderQuery,
      data: matchedVault?.id,
    }
  }

  const matchedVault = findApiTokenVaultForAsset(apiTokenQuery.data, asset)

  if(matchedVault === undefined 
    && primaryAssets !== undefined 
    && primaryAssets.data !== undefined 
    && primaryAssets.data?.length > 0){
    const relevantPrimaryAssets = primaryAssets.data.filter(pa => pa.vaultType === type)
    const index = relevantPrimaryAssets?.findIndex((v) => v.vaultAssetAddress === asset)
    return {
      ...apiTokenQuery,
      data: index,
    }
  }

  return {
    ...apiTokenQuery,
    data: matchedVault?.id,
  }
}
