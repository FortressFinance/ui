import { Address } from "wagmi"

import { useApiConcentratorStaticData } from "@/hooks/lib/api/useApiConcentratorStaticData"

export function useApiConcentratorVault({
  targetAsset,
  primaryAsset,
}: {
  targetAsset?: Address
  primaryAsset?: Address
}) {
  const apiQuery = useApiConcentratorStaticData()
  const targetAssetToYbToken: Record<Address, Set<Address>> = {} // target to primaryKey
  apiQuery.data?.forEach((data) => {
    const curTargetAsset = data?.target_asset?.address
    const curPrimaryAsset = data.concentrator.primaryAsset?.address
    if (
      !!targetAssetToYbToken &&
      !!targetAsset &&
      !!primaryAsset &&
      targetAsset.toLocaleUpperCase() === curTargetAsset.toLocaleUpperCase() &&
      primaryAsset.toLocaleLowerCase() === curPrimaryAsset.toLocaleLowerCase()
    ) {
      if (!targetAssetToYbToken[curTargetAsset]) {
        targetAssetToYbToken[curTargetAsset] = new Set()
      }
      targetAssetToYbToken[curTargetAsset].add(
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
