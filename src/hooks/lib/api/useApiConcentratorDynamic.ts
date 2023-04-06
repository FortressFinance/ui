import { useQuery } from "@tanstack/react-query"
import { useAccount } from "wagmi"

import {
  ConcentratorStaticData,
  getConcentratorDynamicData,
} from "@/lib/api/concentrators"
import { queryKeys } from "@/lib/helpers"
import { VaultType } from "@/lib/types"
import { useActiveChainId } from "@/hooks/useActiveChainId"
import { useIsCurveVault } from "@/hooks/useVaultTypes"

export function useApiConcentratorDynamic({
  targetAssetId,
  concentratorId,
  type,
}: {
  targetAssetId: ConcentratorStaticData["target_asset"]["targetAssetId"]
  concentratorId: ConcentratorStaticData["concentrator"]["ybToken"]["concentratorId"]
  type: VaultType
}) {
  const isCurve = useIsCurveVault(type)
  const { address: user } = useAccount()
  const chainId = useActiveChainId()
  return useQuery({
    ...queryKeys.concentrators.detail({
      targetAssetId,
      concentratorId,
      chainId,
      user,
      type,
    }),
    queryFn: () =>
      getConcentratorDynamicData({
        chainId,
        isCurve,
        targetAssetId,
        concentratorId,
        user: user ?? "0x",
      }),
    retry: false,
  })
}
