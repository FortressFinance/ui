import { useQuery } from "@tanstack/react-query"
import { useAccount } from "wagmi"

import {
  CompounderVaultStaticData,
  getCompounderVaultDynamicData,
  getTokenVaultDynamicData,
} from "@/lib/api/vaults"
import { queryKeys } from "@/lib/helpers"
import { VaultType } from "@/lib/types"
import useActiveChainId from "@/hooks/useActiveChainId"
import useIsCurve from "@/hooks/useIsCurve"
import useIsTokenCompounder from "@/hooks/useIsTokenCompounder"

export function useApiVaultDynamic({
  type,
  poolId: id,
}: {
  type: VaultType
  poolId: CompounderVaultStaticData["poolId"]
}) {
  const _isCurve = useIsCurve(type)
  const isCurve = _isCurve ?? true
  const isToken = useIsTokenCompounder(type)
  const { address: user } = useAccount()
  const chainId = useActiveChainId()

  return useQuery({
    ...queryKeys.vaults.dynamic({ id, chainId, user, type }),
    queryFn: () =>
      isToken
        ? getTokenVaultDynamicData({ chainId, id, user })
        : getCompounderVaultDynamicData({ chainId, isCurve, id, user }),
    retry: false,
    enabled: id !== undefined,
  })
}
