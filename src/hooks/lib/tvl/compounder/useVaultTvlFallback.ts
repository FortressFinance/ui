import { VaultDynamicProps } from "@/lib/types"
import useVaultTotalAssets from "@/hooks/lib/tvl/compounder/useVaultTotalAssets"
import { useTokenPriceUsd } from "@/hooks/useTokenPriceUsd"

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
