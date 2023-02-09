import { useQuery } from "@tanstack/react-query"

import { getCompounderVaultsStaticData } from "@/lib/api/vaults"
import { VaultType } from "@/lib/types"
import useActiveChainId from "@/hooks/useActiveChainId"
import useIsCurve from "@/hooks/useIsCurve"
import useIsTokenCompounder from "@/hooks/useIsTokenCompounder"

// TODO: Create combined `useApiVaults` hook after https://github.com/FortressFinance/issues/issues/110 is implemented

export function useApiCompounderVaults({ type }: { type: VaultType }) {
  const chainId = useActiveChainId()
  const isCurve = useIsCurve(type)
  const isToken = useIsTokenCompounder(type)
  return useQuery([chainId, "pools", type], {
    queryFn: () =>
      getCompounderVaultsStaticData({ chainId, isCurve: isCurve ?? true }),
    retry: false,
    enabled: !isToken,
  })
}
