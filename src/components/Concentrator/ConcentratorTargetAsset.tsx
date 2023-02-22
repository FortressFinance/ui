import { FC } from "react"

import { TargetAsset } from "@/lib/types"
import {
  useConcentratorVault,
  useListConcentrators,
} from "@/hooks/data/concentrators"
import { useFirstConcentrator } from "@/hooks/util"

import { AssetBalance, AssetLogo, AssetSymbol } from "@/components/Asset"

type ConcentratorTargetAssetProps = {
  concentratorTargetAsset?: TargetAsset
}

export const ConcentratorTargetAssetSymbol: FC<
  ConcentratorTargetAssetProps
> = ({ concentratorTargetAsset }) => {
  const concentratorsList = useListConcentrators()
  const firstConcentrator = useFirstConcentrator({
    concentratorsList,
    concentratorTargetAsset,
  })
  const concentrator = useConcentratorVault({
    concentratorTargetAsset,
    vaultAssetAddress: firstConcentrator?.vaultAssetAddress,
    vaultType: firstConcentrator?.vaultType ?? "balancer",
  })
  return (
    <AssetSymbol
      address={concentrator.data?.rewardTokenAddress}
      isLoading={concentratorsList.isLoading || concentrator.isLoading}
    />
  )
}

export const ConcentratorTargetAssetBalance: FC<
  ConcentratorTargetAssetProps
> = ({ concentratorTargetAsset }) => {
  const concentratorsList = useListConcentrators()
  const firstConcentrator = useFirstConcentrator({
    concentratorsList,
    concentratorTargetAsset,
  })
  const concentrator = useConcentratorVault({
    concentratorTargetAsset,
    vaultAssetAddress: firstConcentrator?.vaultAssetAddress,
    vaultType: firstConcentrator?.vaultType ?? "balancer",
  })
  return (
    <AssetBalance
      address={concentrator.data?.rewardTokenAddress}
      isLoading={concentratorsList.isLoading || concentrator.isLoading}
    />
  )
}

export const ConcentratorTargetAssetLogo: FC<ConcentratorTargetAssetProps> = ({
  concentratorTargetAsset,
}) => {
  const concentratorsList = useListConcentrators()
  const firstConcentrator = useFirstConcentrator({
    concentratorsList,
    concentratorTargetAsset,
  })
  const concentrator = useConcentratorVault({
    concentratorTargetAsset,
    vaultAssetAddress: firstConcentrator?.vaultAssetAddress,
    vaultType: firstConcentrator?.vaultType ?? "balancer",
  })
  return (
    <AssetLogo
      tokenAddress={concentrator.data?.rewardTokenAddress}
      name="token"
    />
  )
}
