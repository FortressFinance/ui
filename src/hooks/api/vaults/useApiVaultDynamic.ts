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
import {
  useIsCurveCompounder,
  useIsTokenCompounder,
} from "@/hooks/useVaultTypes"

export function useApiVaultDynamic({
  type,
  poolId: id,
}: {
  type: VaultType
  poolId: CompounderVaultStaticData["id"]
}) {
  const isCurve = useIsCurveCompounder(type)
  const isToken = useIsTokenCompounder(type)
  const { address: user } = useAccount()
  const chainId = useActiveChainId()

  return useQuery({
    ...queryKeys.vaults.detail({ id, chainId, user, type }),
    queryFn: () =>
      isToken
        ? getTokenVaultDynamicData({ chainId, id, user })
        : getCompounderVaultDynamicData({ chainId, isCurve, id, user }),
    retry: false,
    enabled: id !== undefined,
  })
}
