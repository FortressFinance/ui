import { VaultDynamicProps } from "@/lib/types"
import { useTokenPriceUsd } from "@/hooks/data/tokens"
import useVaultTotalAssets from "@/hooks/data/vaults/fallbacks/tvl/useVaultTotalAssets"

export default function useVaultTvlFallback({
  asset,
  vaultAddress,
  enabled,
}: {
  asset: VaultDynamicProps["asset"]
  vaultAddress: VaultDynamicProps["vaultAddress"]
  enabled: boolean
}) {
  const { data: primaryAssetPriceUsd, isLoading: isLoadingPricer } =
    useTokenPriceUsd({ asset, enabled })
  const { data: totalAssets, isLoading: isLoadingTotalAssets } =
    useVaultTotalAssets({ vaultAddress, enabled })
  return {
    isLoading: isLoadingPricer || isLoadingTotalAssets,
    data:
      Number(primaryAssetPriceUsd ?? 0) *
      (Number(totalAssets === undefined ? "0" : totalAssets.toString()) / 1e18),
  }
}
