import { VaultDynamicProps } from "@/lib/types"
import useVaultTotalAssets from "@/hooks/lib/tvl/compounder/useVaultTotalAssets"
import { useTokenPriceUsd } from "@/hooks/useTokenPriceUsd"

export default function useVaultTvlFallback({
  asset,
  vaultAddress,
  enabled,
}: Pick<VaultDynamicProps, "asset" | "vaultAddress"> & {
  enabled?: boolean
}) {
  const { data: primaryAssetPriceUsd, isLoading: isLoadingPricer } =
    useTokenPriceUsd({ asset, enabled })
  const { data: totalAssets, isLoading: isLoadingTotalAssets } =
    useVaultTotalAssets({ vaultAddress, enabled })
  return {
    isLoading: isLoadingPricer || isLoadingTotalAssets,
    data: {
      usdTvl:
        Number(primaryAssetPriceUsd ?? 0) * (Number(totalAssets ?? "0") / 1e18),
      tvl: String(totalAssets ?? 0),
    },
  }
}
