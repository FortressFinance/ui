import { useQuery } from "@tanstack/react-query"

import { getCompounderVaultsStaticData } from "@/lib/api/vaults"
import { queryKeys } from "@/lib/helpers"
import { CompounderVaultProps } from "@/lib/types"
import { useActiveChainId } from "@/hooks"
import { useIsCurveVault, useIsTokenVault } from "@/hooks/useVaultTypes"

// TODO: Create combined `useApiVaults` hook after https://github.com/FortressFinance/issues/issues/110 is implemented

export function useApiCompounderVaults({
  type,
}: Pick<CompounderVaultProps, "type">) {
  const chainId = useActiveChainId()
  const isCurve = useIsCurveVault(type)
  const isToken = useIsTokenVault(type)
  return {
    ...useQuery({
      ...queryKeys.vaults.list({ chainId, type }),
      queryFn: () =>
        getCompounderVaultsStaticData({ chainId, isCurve: isCurve ?? true }),
      retry: false,
      enabled: !isToken,
    }),
    isEnabled: !isToken,
  }
}
