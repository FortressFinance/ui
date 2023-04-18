import { BigNumber, ethers } from "ethers"
import { FC } from "react"
import { Address } from "wagmi"

import { formatPercentage, formatUsd } from "@/lib/helpers"
import { FilterCategory } from "@/lib/types"
import {
  useClientReady,
  useConcentratorApy,
  useConcentratorAum,
  useConcentratorClaim,
  useConcentratorPendingReward,
  useConcentratorTargetAssets,
  useConcentratorVault,
  useConcentratorVaultList,
  useFirstConcentrator,
  useIsConcentratorCurveVault,
  useListConcentrators,
  useTokenOrNative,
} from "@/hooks"

import Button from "@/components/Button"
import {
  ConcentratorTargetAssetBalance,
  ConcentratorTargetAssetLogo,
  ConcentratorTargetAssetSymbol,
} from "@/components/Concentrator/ConcentratorTargetAsset"
import Skeleton from "@/components/Skeleton"
import { GradientText } from "@/components/Typography"

type ConcentratorRewardsProps = {
  concentratorTargetAsset: Address
  filterCategory: FilterCategory
}

export const ConcentratorRewards: FC<ConcentratorRewardsProps> = ({
  concentratorTargetAsset,
  filterCategory,
}) => {
  return (
    <div className="divide-y divide-pink/30 rounded-lg bg-pink-900/80 px-4 backdrop-blur-md">
      <div className="grid grid-cols-[auto,1fr,auto] items-center gap-2 py-4">
        <div className="relative h-9 w-9 rounded-full bg-white">
          <ConcentratorTargetAssetLogo
            concentratorTargetAsset={concentratorTargetAsset}
          />
        </div>
        <div>
          <h1 className="text-sm">Concentrator</h1>
          <h2 className="font-semibold">
            <GradientText>
              <ConcentratorTargetAssetSymbol
                concentratorTargetAsset={concentratorTargetAsset}
              />
            </GradientText>
          </h2>
        </div>
        <div>
          <dl className="text-right">
            <dt className="text-sm">APY</dt>
            <dd className="font-semibold">
              <GradientText>
                <ConcentratorRewardsApy
                  concentratorTargetAsset={concentratorTargetAsset}
                  filterCategory={filterCategory}
                />
              </GradientText>
            </dd>
          </dl>
        </div>
      </div>
      <div className="py-4">
        <dl className="grid grid-cols-[1fr,auto] gap-y-2">
          <dt className="text-xs font-medium text-white/80">AUM</dt>
          <dd className="text-right text-xs font-medium text-white/80">
            <ConcentratorRewardsAum
              concentratorTargetAsset={concentratorTargetAsset}
              filterCategory={filterCategory}
            />
          </dd>
          <dt className="text-xs font-medium text-white/80">Balance</dt>
          <dd className="text-right text-xs font-medium text-white/80">
            <ConcentratorTargetAssetBalance
              concentratorTargetAsset={concentratorTargetAsset}
            />{" "}
            <ConcentratorTargetAssetSymbol
              concentratorTargetAsset={concentratorTargetAsset}
            />
          </dd>
          <dt className="text-sm font-semibold leading-relaxed">
            <GradientText>Rewards</GradientText>
          </dt>
          <dd className="text-right text-sm font-bold leading-relaxed">
            <GradientText>
              <ConcentratorRewardsBalance
                concentratorTargetAsset={concentratorTargetAsset}
                filterCategory={filterCategory}
              />{" "}
              <ConcentratorTargetAssetSymbol
                concentratorTargetAsset={concentratorTargetAsset}
              />
            </GradientText>
          </dd>
        </dl>

        <ConcentratorClaimButton
          concentratorTargetAsset={concentratorTargetAsset}
          filterCategory={filterCategory}
        />
      </div>
    </div>
  )
}

const ConcentratorRewardsAum: FC<ConcentratorRewardsProps> = ({
  concentratorTargetAsset,
  filterCategory,
}) => {
  const isReady = useClientReady()
  const {
    data: concentratorTargetAssets,
    isLoading: concentratorTargetAssetsIsLoading,
  } = useConcentratorTargetAssets()
  const concentratorsList = useListConcentrators({ concentratorTargetAssets })
  const firstConcentrator = useFirstConcentrator({
    concentratorsList,
    concentratorTargetAsset,
    filterCategory,
  })
  const concentrator = useConcentratorVault({
    targetAsset: concentratorTargetAsset,
    primaryAsset: firstConcentrator?.vaultAssetAddress,
    type: firstConcentrator?.vaultType,
  })

  const tvl = useConcentratorAum({
    targetAsset: concentratorTargetAsset,
    ybToken: concentrator.data?.ybTokenAddress ?? "0x",
  })

  return (
    <Skeleton
      isLoading={
        !isReady ||
        concentratorTargetAssetsIsLoading ||
        concentratorsList.isLoading ||
        concentrator.isLoading ||
        tvl.isLoading
      }
    >
      {formatUsd({ abbreviate: true, amount: tvl.data })}
    </Skeleton>
  )
}

const ConcentratorRewardsApy: FC<ConcentratorRewardsProps> = ({
  concentratorTargetAsset,
  filterCategory,
}) => {
  const isReady = useClientReady()
  const {
    data: concentratorTargetAssets,
    isLoading: concentratorTargetAssetsIsLoading,
  } = useConcentratorTargetAssets()
  const concentratorsList = useListConcentrators({ concentratorTargetAssets })
  const firstConcentrator = useFirstConcentrator({
    concentratorsList,
    concentratorTargetAsset,
    filterCategory,
  })

  const totalApy = useConcentratorApy({
    targetAsset: concentratorTargetAsset,
    primaryAsset: firstConcentrator?.vaultAssetAddress ?? "0x",
    type: firstConcentrator?.vaultType ?? "balancer",
  })

  return (
    <Skeleton
      isLoading={
        !isReady ||
        concentratorTargetAssetsIsLoading ||
        concentratorsList.isLoading ||
        totalApy.isLoading
      }
    >
      {formatPercentage(totalApy.data)}
    </Skeleton>
  )
}

const ConcentratorRewardsBalance: FC<ConcentratorRewardsProps> = ({
  concentratorTargetAsset,
  filterCategory,
}) => {
  const isReady = useClientReady()
  const {
    data: concentratorTargetAssets,
    isLoading: concentratorTargetAssetsIsLoading,
  } = useConcentratorTargetAssets()
  const concentratorsList = useListConcentrators({ concentratorTargetAssets })
  const firstConcentrator = useFirstConcentrator({
    concentratorsList,
    concentratorTargetAsset,
    filterCategory,
  })
  const concentrator = useConcentratorVault({
    targetAsset: concentratorTargetAsset,
    primaryAsset: firstConcentrator?.vaultAssetAddress,
    type: firstConcentrator?.vaultType,
  })
  const rewardsBalance = useConcentratorPendingReward({
    ybTokenList: [concentrator.data?.ybTokenAddress],
  })
  const rewardToken = useTokenOrNative({
    address: concentrator.data?.rewardTokenAddress,
  })
  const formatted = ethers.utils.formatUnits(
    rewardsBalance.data !== undefined && rewardsBalance.data.length > 0
      ? rewardsBalance.data[0]
      : BigNumber.from(0),
    rewardToken.data?.decimals ?? 18
  )
  return (
    <Skeleton
      isLoading={
        concentratorTargetAssetsIsLoading ||
        concentratorsList.isLoading ||
        concentrator.isLoading ||
        rewardsBalance.isLoading ||
        rewardToken.isLoading ||
        !isReady
      }
    >
      {formatted}
    </Skeleton>
  )
}

const ConcentratorClaimButton: FC<ConcentratorRewardsProps> = ({
  concentratorTargetAsset,
}) => {
  const isReady = useClientReady()
  const {
    data: concentratorTargetAssets,
    isLoading: concentratorTargetAssetsIsLoading,
  } = useConcentratorTargetAssets()
  const concentratorsList = useListConcentrators({ concentratorTargetAssets })
  const isCurve = useIsConcentratorCurveVault(concentratorTargetAsset)
  const primaryAssetList = concentratorsList.data?.map(
    (x) => x.vaultAssetAddress
  )
  const ybTokenList = useConcentratorVaultList({
    targetAsset: concentratorTargetAsset,
    primaryAssetList: primaryAssetList ?? [],
    type: isCurve ? "curve" : "balancer",
  })
  const claim = useConcentratorClaim({
    targetAsset: concentratorTargetAsset,
    ybTokenList: ybTokenList.data ?? [],
  })
  const rewardsBalance = useConcentratorPendingReward({
    ybTokenList: ybTokenList.data ?? [],
  })
  return (
    <Button
      className="mt-4 w-full py-2"
      disabled={rewardsBalance.data?.every((q) => q.eq(0)) || !isReady}
      isLoading={
        concentratorTargetAssetsIsLoading ||
        concentratorsList.isLoading ||
        claim.isLoading ||
        !isReady
      }
      onClick={() => claim.write?.()}
    >
      Claim
    </Button>
  )
}
