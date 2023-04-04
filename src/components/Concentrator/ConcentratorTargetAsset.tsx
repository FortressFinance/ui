import { FC } from "react"
import { Address } from "wagmi"

import {
  useConcentratorTargetAssets,
  useConcentratorVault,
  useFirstConcentrator,
  useListConcentrators,
} from "@/hooks"

import { AssetBalance, AssetLogo, AssetSymbol } from "@/components/Asset"

type ConcentratorTargetAssetProps = {
  concentratorTargetAsset?: Address
}

export const ConcentratorTargetAssetSymbol: FC<
  ConcentratorTargetAssetProps
> = ({ concentratorTargetAsset }) => {
  const concentratorTargetAssets = useConcentratorTargetAssets()
  const concentratorsList = useListConcentrators({ concentratorTargetAssets })
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
      isLoading={
        concentratorTargetAssets.isLoading ||
        concentratorsList.isLoading ||
        concentrator.isLoading
      }
    />
  )
}

export const ConcentratorTargetAssetBalance: FC<
  ConcentratorTargetAssetProps
> = ({ concentratorTargetAsset }) => {
  const concentratorTargetAssets = useConcentratorTargetAssets()
  const concentratorsList = useListConcentrators({ concentratorTargetAssets })
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
      isLoading={
        concentratorTargetAssets.isLoading ||
        concentratorsList.isLoading ||
        concentrator.isLoading
      }
    />
  )
}

export const ConcentratorTargetAssetLogo: FC<ConcentratorTargetAssetProps> = ({
  concentratorTargetAsset,
}) => {
  const concentratorTargetAssets = useConcentratorTargetAssets()
  const concentratorsList = useListConcentrators({ concentratorTargetAssets })
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
    <AssetLogo tokenAddress={concentrator.data?.rewardTokenAddress ?? "0x"} />
  )
}
