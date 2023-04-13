import { ConcentratorVaultProps } from "@/lib/types"
import { useConcentratorVault, useTokenPriceUsd } from "@/hooks"
import useVaultTotalAssets from "@/hooks/lib/tvl/compounder/useVaultTotalAssets"

export default function useConcentratorVaultTvlFallback({
  primaryAsset,
  targetAsset,
  type,
}: ConcentratorVaultProps) {
  const concentrator = useConcentratorVault({
    concentratorTargetAsset: targetAsset,
    vaultAssetAddress: primaryAsset,
    vaultType: type,
  })

  const { data: primaryAssetPriceUsd, isLoading: isLoadingPricer } =
    useTokenPriceUsd({ asset: targetAsset, enabled: true })
  const { data: totalAssets, isLoading: isLoadingTotalAssets } =
    useVaultTotalAssets({
      vaultAddress: concentrator?.data?.ybTokenAddress,
      enabled: true,
    })
  return {
    isLoading:
      isLoadingPricer || isLoadingTotalAssets || concentrator.isLoading,
    data:
      Number(primaryAssetPriceUsd ?? 0) *
      (Number(totalAssets === undefined ? "0" : totalAssets.toString()) / 1e18),
  }
}