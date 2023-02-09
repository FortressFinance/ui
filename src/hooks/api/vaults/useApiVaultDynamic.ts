import { useAccount, useQuery } from "wagmi"

import {
  CompounderVaultStaticData,
  getCompounderVaultDynamicData,
  getTokenVaultDynamicData,
} from "@/lib/api/vaults"
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
  const isCurve = useIsCurve(type)
  const isToken = useIsTokenCompounder(type)
  const { address } = useAccount()
  const chainId = useActiveChainId()

  return useQuery([chainId, "pools", type, "data", id, address], {
    queryFn: () =>
      isToken
        ? getTokenVaultDynamicData({
            chainId,
            id,
            user: address || "0x",
          })
        : getCompounderVaultDynamicData({
            chainId,
            isCurve: isCurve ?? true,
            id,
            user: address || "0x",
          }),
    retry: false,
    enabled: id !== undefined,
  })
}
