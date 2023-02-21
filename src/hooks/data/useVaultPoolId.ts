import { VaultProps } from "@/lib/types"
import { useApiCompounderVaults, useApiTokenVaults } from "@/hooks/api"
import { useCompounder } from "@/hooks/data/compounders"
import { useIsTokenCompounder } from "@/hooks/useVaultTypes"

export default function useVaultPoolId({ asset, type }: VaultProps) {
  const isToken = useIsTokenCompounder(type)
  const { data: vaultTokens } = useCompounder({
    asset,
    type,
  })
  // Preferred: API request
  const apiCompounderQuery = useApiCompounderVaults({ type })
  const apiTokenQuery = useApiTokenVaults({ type })

  if (!isToken) {
    return {
      ...apiCompounderQuery,
      data: apiCompounderQuery.data?.find(
        (p) => p.token.ybToken.address === vaultTokens.ybTokenAddress
      )?.poolId,
    }
  }

  return {
    ...apiTokenQuery,
    data: apiTokenQuery.data?.find(
      (p) => p.token.ybToken.address === vaultTokens.ybTokenAddress
    )?.vaultId,
  }
}
