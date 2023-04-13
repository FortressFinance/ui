import { useQuery } from "@tanstack/react-query"

import { getTokenVaultsStaticData } from "@/lib/api/vaults"
import { queryKeys } from "@/lib/helpers"
import { CompounderVaultProps } from "@/lib/types"
import { useActiveChainId } from "@/hooks/useActiveChainId"
import { useIsTokenVault } from "@/hooks/useVaultTypes"

// TODO: Create combined `useApiVaults` hook after https://github.com/FortressFinance/issues/issues/110 is implemented

export function useApiTokenVaults({
  type,
}: Pick<CompounderVaultProps, "type">) {
  const chainId = useActiveChainId()
  const isToken = useIsTokenVault(type)
  return {
    ...useQuery({
      ...queryKeys.vaults.list({ chainId, type }),
      queryFn: () => getTokenVaultsStaticData({ chainId }),
      retry: false,
      enabled: isToken,
    }),
    isEnabled: isToken,
  }
}
