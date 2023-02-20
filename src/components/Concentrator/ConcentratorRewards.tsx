import { BigNumber, ethers } from "ethers"
import { FC } from "react"
import { Address } from "wagmi"

import { FilterCategory } from "@/lib/types"
import {
  useConcentratorAddress,
  useConcentratorClaim,
  useConcentratorPendingReward,
} from "@/hooks/data/concentrators"
import useTokenOrNative from "@/hooks/useTokenOrNative"
import { useClientReady } from "@/hooks/util/useClientReady"

import { AssetBalance, AssetLogo, AssetSymbol } from "@/components/Asset"
import Button from "@/components/Button"
import Skeleton from "@/components/Skeleton"

type ConcentratorRewardsProps = {
  concentratorTargetAsset: Address
  filterCategory: FilterCategory
}

export const ConcentratorRewards: FC<ConcentratorRewardsProps> = ({
  concentratorTargetAsset,
  filterCategory,
}) => {
  return (
    <div className="divide-y divide-pink/30 rounded-md bg-pink-900/80 px-4 backdrop-blur-md">
      <div className="grid grid-cols-[auto,1fr,auto] items-center gap-2 py-4">
        <div className="relative h-9 w-9 rounded-full bg-white">
          <AssetLogo name="token" tokenAddress={concentratorTargetAsset} />
        </div>
        <div>
          <h1 className="text-sm">Concentrator</h1>
          <h2 className="font-semibold">
            <span className="bg-gradient-to-r from-orange to-pink bg-clip-text text-transparent">
              <AssetSymbol address={concentratorTargetAsset} />
            </span>
          </h2>
        </div>
        <div>
          <dl className="text-right">
            <dt className="text-sm">APY</dt>
            <dd className="font-semibold">
              <span className="bg-gradient-to-r from-orange to-pink bg-clip-text text-transparent">
                23.35%
              </span>
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
            <AssetBalance address={concentratorTargetAsset} />{" "}
            <AssetSymbol address={concentratorTargetAsset} />
          </dd>
          <dt className="text-sm font-semibold leading-relaxed">
            <span className="bg-gradient-to-r from-orange to-pink bg-clip-text text-transparent">
              Rewards
            </span>
          </dt>
          <dd className="text-right text-sm font-bold leading-relaxed">
            <ConcentratorRewardsBalance
              concentratorTargetAsset={concentratorTargetAsset}
              filterCategory={filterCategory}
            />{" "}
            <AssetSymbol address={concentratorTargetAsset} />
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
  const concentratorAddress = useConcentratorAddress({
    concentratorTargetAsset,
    filterCategory,
  })
  const rewardsBalance = useConcentratorPendingReward({
    concentratorAddress: concentratorAddress.data,
  })
  const rewardToken = useTokenOrNative({ address: concentratorTargetAsset })
  const formatted = ethers.utils.formatUnits(
    rewardsBalance.data ?? BigNumber.from(0),
    rewardToken.data?.decimals ?? 18
  )
  return (
    <Skeleton
      isLoading={
        concentratorAddress.isLoading || rewardsBalance.isLoading || !isReady
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
  const concentratorAddress = useConcentratorAddress({
    concentratorTargetAsset,
    filterCategory,
  })
  const rewardsBalance = useConcentratorPendingReward({
    concentratorAddress: concentratorAddress.data,
  })
  const claim = useConcentratorClaim({
    concentratorAddress: concentratorAddress.data,
  })
  return (
    <Button
      className="mt-4 w-full py-2"
      disabled={rewardsBalance.data?.eq(0) || !isReady}
      isLoading={concentratorAddress.isLoading || claim.isLoading || !isReady}
      onClick={() => claim.write?.()}
    >
      Claim
    </Button>
  )
}
