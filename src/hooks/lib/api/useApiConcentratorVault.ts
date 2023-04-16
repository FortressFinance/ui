import { Address } from "wagmi"

import { useApiConcentratorStaticData } from "@/hooks/lib/api/useApiConcentratorStaticData"

export function useApiConcentratorVault({
  targetAsset,
}: {
  targetAsset?: Address
}) {
  const apiQuery = useApiConcentratorStaticData()
  const targetAssetToYbToken: Record<Address, Address> = {} // target to primaryKey
  apiQuery.data?.map((data) => {
    const targetAssetAddress = data?.target_asset?.address
    if (
      targetAssetToYbToken !== undefined &&
      targetAsset !== undefined &&
      targetAsset.toLocaleUpperCase() === targetAssetAddress.toLocaleUpperCase()
    ) {
      targetAssetToYbToken[targetAssetAddress] =
        data?.concentrator?.ybToken?.address
    }
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ybTokens: any[] = []
  for (const targetAsset in targetAssetToYbToken) {
    const ybToken = targetAssetToYbToken[targetAsset as Address]
    ybTokens.push({
      ybTokenAddress: ybToken,
      rewardTokenAddress: targetAsset ?? "0x",
    })
  }
  return {
    ...apiQuery,
    data: ybTokens.length > 0 ? ybTokens[0] : undefined,
  }
}
