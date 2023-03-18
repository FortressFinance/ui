import { useQuery } from "@tanstack/react-query"

import { getCompounderVaultsStaticData } from "@/lib/api/vaults"
import { queryKeys } from "@/lib/helpers"
import { VaultProps } from "@/lib/types"
import { useActiveChainId } from "@/hooks"
import {
  useIsCurveCompounder,
  useIsTokenCompounder,
} from "@/hooks/useVaultTypes"

// TODO: Create combined `useApiVaults` hook after https://github.com/FortressFinance/issues/issues/110 is implemented

export function useApiCompounderVaults({ type }: Pick<VaultProps, "type">) {
  const chainId = useActiveChainId()
  const isCurve = useIsCurveCompounder(type)
  const isToken = useIsTokenCompounder(type)
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
