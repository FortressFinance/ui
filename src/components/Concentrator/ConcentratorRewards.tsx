import { BigNumber, ethers } from "ethers"
import { FC } from "react"
import { Address } from "wagmi"

import { FilterCategory } from "@/lib/types"
import {
  useClientReady,
  useConcentratorClaim,
  useConcentratorPendingReward,
  useConcentratorTargetAssets,
  useConcentratorVault,
  useFirstConcentrator,
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
              <GradientText>23.35%</GradientText>
            </dd>
          </dl>
        </div>
      </div>
      <div className="py-4">
        <dl className="grid grid-cols-[1fr,auto] gap-y-2">
          <dt className="text-xs font-medium text-white/80">AUM</dt>
          <dd className="text-right text-xs font-medium text-white/80">
            $3,067,000
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

const ConcentratorRewardsBalance: FC<ConcentratorRewardsProps> = ({
  concentratorTargetAsset,
  filterCategory,
}) => {
  const isReady = useClientReady()
  const concentratorTargetAssets = useConcentratorTargetAssets()
  const concentratorsList = useListConcentrators({ concentratorTargetAssets })
  const firstConcentrator = useFirstConcentrator({
    concentratorsList,
    concentratorTargetAsset,
    filterCategory,
  })
  const concentrator = useConcentratorVault({
    concentratorTargetAsset,
    vaultAssetAddress: firstConcentrator?.vaultAssetAddress,
    vaultType: firstConcentrator?.vaultType,
  })
  const rewardsBalance = useConcentratorPendingReward({
    concentratorAddress: concentrator.data?.ybTokenAddress,
  })
  const rewardToken = useTokenOrNative({
    address: concentrator.data?.rewardTokenAddress,
  })
  const formatted = ethers.utils.formatUnits(
    rewardsBalance.data ?? BigNumber.from(0),
    rewardToken.data?.decimals ?? 18
  )
  return (
    <Skeleton
      isLoading={
        concentratorTargetAssets.isLoading ||
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
  filterCategory,
}) => {
  const isReady = useClientReady()
  const concentratorTargetAssets = useConcentratorTargetAssets()
  const concentratorsList = useListConcentrators({ concentratorTargetAssets })
  const firstConcentrator = useFirstConcentrator({
    concentratorsList,
    concentratorTargetAsset,
    filterCategory,
  })
  const concentrator = useConcentratorVault({
    concentratorTargetAsset,
    vaultAssetAddress: firstConcentrator?.vaultAssetAddress,
    vaultType: firstConcentrator?.vaultType,
  })
  const rewardsBalance = useConcentratorPendingReward({
    concentratorAddress: concentrator.data?.ybTokenAddress,
  })
  const claim = useConcentratorClaim({
    concentratorAddress: concentrator.data?.rewardTokenAddress,
  })
  return (
    <Button
      className="mt-4 w-full py-2"
      disabled={rewardsBalance.data?.eq(0) || !isReady}
      isLoading={
        concentratorTargetAssets.isLoading ||
        concentratorsList.isLoading ||
        concentrator.isLoading ||
        rewardsBalance.isLoading ||
        claim.isLoading ||
        !isReady
      }
      onClick={() => claim.write?.()}
    >
      Claim
    </Button>
  )
}
