import {
  findApiCompounderVaultForAsset,
  findApiTokenVaultForAsset,
} from "@/lib/findApiVaultForAsset"
import { VaultProps } from "@/lib/types"
import { useApiCompounderVaults, useApiTokenVaults } from "@/hooks/api"
import { useIsTokenCompounder } from "@/hooks/useVaultTypes"

// TODO: Support Concentrator vaults

export default function useVaultPoolId({ asset, type }: VaultProps) {
  const isToken = useIsTokenCompounder(type)

  // Preferred: API request
  const apiCompounderQuery = useApiCompounderVaults({ type })
  const apiTokenQuery = useApiTokenVaults({ type })

  if (!isToken) {
    const matchedVault = findApiCompounderVaultForAsset(
      apiCompounderQuery.data,
      asset
    )
    return {
      ...apiCompounderQuery,
      data: matchedVault?.id,
    }
  }

  const matchedVault = findApiTokenVaultForAsset(apiTokenQuery.data, asset)

  return {
    ...apiTokenQuery,
    data: matchedVault?.id,
  }
}
