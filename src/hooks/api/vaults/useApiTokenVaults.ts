import { useQuery } from "@tanstack/react-query"

import { getTokenVaultsStaticData } from "@/lib/api/vaults"
import { queryKeys } from "@/lib/helpers"
import { VaultType } from "@/lib/types"
import useActiveChainId from "@/hooks/useActiveChainId"
import { useIsTokenCompounder } from "@/hooks/useVaultTypes"

// TODO: Create combined `useApiVaults` hook after https://github.com/FortressFinance/issues/issues/110 is implemented

export function useApiTokenVaults({ type }: { type: VaultType }) {
  const chainId = useActiveChainId()
  const isToken = useIsTokenCompounder(type)
  return useQuery({
    ...queryKeys.vaults.list({ chainId, type }),
    queryFn: () => getTokenVaultsStaticData({ chainId }),
    retry: false,
    enabled: isToken,
  })
}
