import { VaultDynamicProps } from "@/lib/types"
import usePricer from "@/hooks/data/vaults/fallbacks/pricer/usePricer"
import useVaultTotalAssets from "@/hooks/data/vaults/fallbacks/tvl/useVaultTotalAssets"

export default function useVaultTotalAprFallback({
  asset,
  vaultAddress,
  enabled,
}: {
  asset: VaultDynamicProps["asset"]
  vaultAddress: VaultDynamicProps["vaultAddress"]
  enabled: boolean
}) {
  const { data: primaryAssetPriceUsd, isLoading: isLoadingPricer } = usePricer({primaryAsset: asset, enabled})
  const { data: totalAssets, isLoading: isLoadingTotalAssets } = useVaultTotalAssets({ vaultAddress, enabled})
  return {
    isLoading: isLoadingPricer || isLoadingTotalAssets,
    data:
      Number(primaryAssetPriceUsd ?? 0) *
      (Number(totalAssets === undefined ? "0" : totalAssets.toString()) / 1e18),
  }
}
