import { Address } from "wagmi"

import {
  findApiCompounderVaultForAsset,
  findApiTokenVaultForAsset,
} from "@/lib/findApiVaultForAsset"
import { VaultType } from "@/lib/types"
import { useApiCompounderVaults } from "@/hooks/lib/api/useApiCompounderVaults"
import { useApiTokenVaults } from "@/hooks/lib/api/useApiTokenVaults"
import { useListCompounders } from "@/hooks/useListCompounders"
import { useIsTokenVault } from "@/hooks/useVaultTypes"

export function useVaultPoolId({
  asset,
  type,
  enabled = true,
}: {
  asset: Address
  type: VaultType
  enabled: boolean
}) {
  const isToken = useIsTokenVault(type)

  // Preferred: API request
  const apiCompounderQuery = useApiCompounderVaults({ type, enabled })
  const apiTokenQuery = useApiTokenVaults({ type, enabled })

  const primaryAssets = useListCompounders()

  if (!isToken) {
    const matchedVault = findApiCompounderVaultForAsset(
      apiCompounderQuery.data,
      asset
    )

    if (
      matchedVault === undefined &&
      primaryAssets !== undefined &&
      primaryAssets.data !== undefined &&
      primaryAssets.data?.length > 0
    ) {
      const relevantPrimaryAssets = primaryAssets.data.filter(
        (pa) => pa.vaultType === type
      )
      const index = relevantPrimaryAssets?.findIndex(
        (v) => v.vaultAssetAddress === asset
      )
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

  if (
    matchedVault === undefined &&
    primaryAssets !== undefined &&
    primaryAssets.data !== undefined &&
    primaryAssets.data?.length > 0
  ) {
    const relevantPrimaryAssets = primaryAssets.data.filter(
      (pa) => pa.vaultType === type
    )
    const index = relevantPrimaryAssets?.findIndex(
      (v) => v.vaultAssetAddress === asset
    )
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
