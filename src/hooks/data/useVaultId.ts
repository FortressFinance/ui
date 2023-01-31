import {
  findApiCompounderVaultForAsset,
  findApiTokenVaultForAsset,
} from "@/lib/findApiVaultForAsset"
import { useApiListCompounderVaults, useApiListTokenVaults } from "@/hooks/api"
import { VaultProps } from "@/hooks/types"
import useIsTokenCompounder from "@/hooks/useIsTokenCompounder"

export default function useVaultId({ asset, type }: VaultProps) {
  const isToken = useIsTokenCompounder(type)

  // Preferred: API request
  const apiCompounderQuery = useApiListCompounderVaults({ type })
  const apiTokenQuery = useApiListTokenVaults({ type })

  if (isToken) {
    return {
      ...apiTokenQuery,
      data: findApiTokenVaultForAsset(apiTokenQuery.data ?? undefined, asset)
        ?.vaultId,
    }
  }

  return {
    ...apiCompounderQuery,
    data: findApiCompounderVaultForAsset(
      apiCompounderQuery.data ?? undefined,
      asset
    )?.poolId,
  }
}
