import { Address } from "wagmi"

import { VaultType } from "@/lib/types"
import { useConcentratorVault, useTokenPriceUsd } from "@/hooks"
import useVaultTotalAssets from "@/hooks/lib/tvl/compounder/useVaultTotalAssets"

export default function useConcentratorVaultTvlFallback({
  targetAsset,
  primaryAsset,
  type,
}: {
  targetAsset: Address
  primaryAsset: Address
  type: VaultType
}) {
  const concentrator = useConcentratorVault({
    targetAsset,
    primaryAsset,
    type,
  })

  const { data: primaryAssetPriceUsd, isLoading: isLoadingPricer } =
    useTokenPriceUsd({ asset: primaryAsset, enabled: true })
  const { data: totalAssets, isLoading: isLoadingTotalAssets } =
    useVaultTotalAssets({
      vaultAddress: concentrator?.data?.ybTokenAddress,
      enabled: true,
    })
  return {
    isLoading:
      isLoadingPricer || isLoadingTotalAssets || concentrator.isLoading,
    data: {
      usdTvl:
        Number(primaryAssetPriceUsd ?? 0) *
        (Number(totalAssets === undefined ? "0" : totalAssets.toString()) /
          1e18),
      tvl: totalAssets === undefined ? "0" : totalAssets.toString(),
    },
  }
}
