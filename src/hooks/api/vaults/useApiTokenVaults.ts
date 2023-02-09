import { useQuery } from "wagmi"

import { getTokenVaultsStaticData } from "@/lib/api/vaults"
import { VaultType } from "@/lib/types"
import useActiveChainId from "@/hooks/useActiveChainId"
import useIsTokenCompounder from "@/hooks/useIsTokenCompounder"

export function useApiTokenVaults({ type }: { type: VaultType }) {
  const chainId = useActiveChainId()
  const isToken = useIsTokenCompounder(type)
  return useQuery([chainId, "pools", type], {
    queryFn: () => getTokenVaultsStaticData({ chainId }),
    retry: false,
    enabled: isToken,
  })
}
