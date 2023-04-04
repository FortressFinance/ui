import { BigNumber } from "ethers"
import { Address } from "wagmi"

import useConcentratorAsset from "@/hooks/lib/tvl/concentrator/useConcentratorAsset"
import { useTokenOrNativeBalance } from "@/hooks/useTokenOrNativeBalance"
import { useTokenPriceUsd } from "@/hooks/useTokenPriceUsd"

export default function useConcentratorAumFallback({
  asset,
  ybTokenAddress,
}: {
  asset: Address
  ybTokenAddress: Address
}) {
  const enabled = true
  const { data: primaryAssetPriceUsd, isLoading: isLoadingPricer } =
    useTokenPriceUsd({ asset, enabled })

  const { data: userShare, isLoading: isLoadingUserShare } =
    useTokenOrNativeBalance({ address: ybTokenAddress })
  const { data: userAsset, isLoading: isLoadingUserAsset } =
    useConcentratorAsset({
      ybTokenAddress,
      share: userShare?.value ?? BigNumber.from(0),
      enabled,
    })

  return {
    isLoading: isLoadingPricer || isLoadingUserShare || isLoadingUserAsset,
    data:
      Number(primaryAssetPriceUsd ?? 0) *
      (Number(userAsset === undefined ? "0" : userAsset.toString()) / 1e18),
  }
}
