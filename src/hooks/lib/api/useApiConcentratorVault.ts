import { Address } from "wagmi"

import { useApiConcentratorStaticData } from "@/hooks/lib/api/useApiConcentratorStaticData"

export function useApiConcentratorVault({
  targetAsset,
  primaryAsset,
  enabled,
}: {
  targetAsset?: Address
  primaryAsset?: Address
  enabled?: boolean
}) {
  const apiQuery = useApiConcentratorStaticData({ enabled })
  const targetAssetToYbToken: Record<Address, Set<Address>> = {} // target to primaryKey
  apiQuery.data?.forEach((data) => {
    const curTargetAsset = data?.target_asset?.address
    const curPrimaryAsset = data.concentrator?.primaryAsset?.address
    if (
      !!targetAssetToYbToken &&
      !!targetAsset &&
      !!primaryAsset &&
      !!curTargetAsset &&
      !!curPrimaryAsset &&
      targetAsset.toLocaleUpperCase() === curTargetAsset.toLocaleUpperCase() &&
      primaryAsset.toLocaleLowerCase() === curPrimaryAsset.toLocaleLowerCase()
    ) {
      if (!targetAssetToYbToken[targetAsset]) {
        targetAssetToYbToken[targetAsset] = new Set()
      }
      targetAssetToYbToken[targetAsset].add(
        data?.concentrator?.ybToken?.address
      )
    }
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ybTokens: any[] = []
  for (const targetAssetKey in targetAssetToYbToken) {
    targetAssetToYbToken[targetAssetKey as Address].forEach((ybToken) => {
      ybTokens.push({
        ybTokenAddress: ybToken,
        rewardTokenAddress: targetAsset ?? "0x",
      })
    })
  }
  return {
    ...apiQuery,
    data: ybTokens.length > 0 ? ybTokens[0] : undefined,
  }
}
