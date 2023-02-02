import { useApiCompounderVaults, useApiTokenVaults } from "@/hooks/api"
import { useVaultTokens } from "@/hooks/data"
import { VaultProps } from "@/hooks/types"
import useIsTokenCompounder from "@/hooks/useIsTokenCompounder"

export default function useVaultPoolId({ asset, type }: VaultProps) {
  const isToken = useIsTokenCompounder(type)
  const { data: vaultTokens } = useVaultTokens({
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