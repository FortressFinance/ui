import { Address } from "wagmi"

import { useApiConcentratorStaticData } from "@/hooks/lib/api/useApiConcentratorStaticData"

export function useApiConcentratorVault({
  concentratorTargetAsset,
  vaultAssetAddress,
}: {
  concentratorTargetAsset?: Address
  vaultAssetAddress?: Address
}) {
  const apiQuery = useApiConcentratorStaticData()
  const targetAssetToYbToken: Record<Address, Address> = {} // target to primaryKey
  apiQuery.data?.map((data) => {
    const targetAsset = data?.target_asset?.address
    if (
      targetAssetToYbToken !== undefined &&
      concentratorTargetAsset !== undefined &&
      concentratorTargetAsset.toLocaleUpperCase() ===
        targetAsset.toLocaleUpperCase()
    ) {
      targetAssetToYbToken[data?.target_asset?.address] =
        data?.concentrator?.ybToken?.address
    }
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ybTokens: any[] = []
  for (const targetAsset in targetAssetToYbToken) {
    const ybToken = targetAssetToYbToken[targetAsset as Address]
    ybTokens.push({
      ybTokenAddress: ybToken,
      rewardTokenAddress: vaultAssetAddress ?? "0x",
    })
  }
  return {
    ...apiQuery,
    data: ybTokens.length > 0 ? ybTokens[0] : undefined,
  }
}
