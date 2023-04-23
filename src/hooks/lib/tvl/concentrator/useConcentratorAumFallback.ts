import { Address } from "wagmi"

import useConcentratorTotalAssets from "@/hooks/lib/tvl/concentrator/useConcentratorTotalAssets"
import { useTokenPriceUsd } from "@/hooks/useTokenPriceUsd"

export default function useConcentratorAumFallback({
  targetAsset,
  enabled,
}: {
  targetAsset: Address
  enabled: boolean
}) {
  const { data: targetAssetPriceUsd, isLoading: isLoadingPricer } =
    useTokenPriceUsd({ asset: targetAsset, enabled })

  const { data: totalAssets, isLoading: isLoadingTotalAssets } =
    useConcentratorTotalAssets({
      targetAsset,
      enabled: true,
    })

  return {
    isLoading: isLoadingPricer || isLoadingTotalAssets,
    data:
      Number(targetAssetPriceUsd ?? 0) *
      (Number(totalAssets === undefined ? "0" : totalAssets.toString()) / 1e18),
  }
}
