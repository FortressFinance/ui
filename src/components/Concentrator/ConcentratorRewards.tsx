import { FC } from "react"
import { BiInfoCircle } from "react-icons/bi"
import { zeroAddress } from "viem"
import { Address, useAccount } from "wagmi"

import { formatCurrencyUnits, formatPercentage, formatUsd } from "@/lib/helpers"
import {
  useClientReady,
  useConcentratorApy,
  useConcentratorAum,
  useConcentratorClaim,
  useConcentratorFirstVaultType,
  useConcentratorPendingReward,
  useConcentratorTargetAssets,
  useConcentratorVaultList,
  useFirstConcentrator,
  useListConcentrators,
  useTokenOrNative,
} from "@/hooks"

import { AssetBalance, AssetLogo, AssetSymbol } from "@/components/Asset"
import Button from "@/components/Button"
import Skeleton from "@/components/Skeleton"
import Tooltip from "@/components/Tooltip"
import { GradientText } from "@/components/Typography"

type ConcentratorRewardsProps = {
  concentratorTargetAsset: Address
}

export const ConcentratorRewards: FC<ConcentratorRewardsProps> = ({
  concentratorTargetAsset,
}) => {
  return (
    <div className="divide-y divide-pink/30 rounded-lg bg-pink-900/80 px-4 backdrop-blur-md">
      <div className="grid grid-cols-[auto,1fr,auto] items-center gap-2 py-4">
        <div className="relative h-9 w-9 rounded-full bg-white">
          <AssetLogo tokenAddress={concentratorTargetAsset} />
        </div>
        <div>
          <Tooltip label="The accumulated rewards are periodically invested into this vault. All accrued rewards can be claimed at any time, even if further rewards are not accruing anymore.">
            <span>
              <h1 className="float-left mr-1 text-sm">Target Asset</h1>
              <BiInfoCircle className="h-5 w-5 cursor-pointer" />
            </span>
          </Tooltip>
          <h2 className="font-semibold">
            <GradientText>
              <AssetSymbol address={concentratorTargetAsset} />
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
            />
          </dd>
          <dt className="text-xs font-medium text-white/80">Balance</dt>
          <dd className="text-right text-xs font-medium text-white/80">
            <AssetBalance
              address={concentratorTargetAsset}
              maximumFractionDigits={6}
            />{" "}
            <AssetSymbol address={concentratorTargetAsset} />
          </dd>
          <dt className="text-sm font-semibold leading-relaxed">
            <GradientText>Rewards</GradientText>
          </dt>
          <dd className="text-right text-sm font-bold leading-relaxed">
            <GradientText>
              <ConcentratorRewardsBalance
                concentratorTargetAsset={concentratorTargetAsset}
              />{" "}
              <AssetSymbol address={concentratorTargetAsset} />
            </GradientText>
          </dd>
        </dl>

        <ConcentratorClaimButton
          concentratorTargetAsset={concentratorTargetAsset}
        />
      </div>
    </div>
  )
}

const ConcentratorRewardsAum: FC<ConcentratorRewardsProps> = ({
  concentratorTargetAsset,
}) => {
  const isReady = useClientReady()
  const tvl = useConcentratorAum({
    targetAsset: concentratorTargetAsset,
  })

  return (
    <Skeleton isLoading={!isReady || tvl.isLoading}>
      {formatUsd({ abbreviate: true, amount: tvl.data })}
    </Skeleton>
  )
}

const ConcentratorRewardsApy: FC<ConcentratorRewardsProps> = ({
  concentratorTargetAsset,
}) => {
  const isReady = useClientReady()
  const {
    data: concentratorTargetAssets,
    isLoading: concentratorTargetAssetsIsLoading,
  } = useConcentratorTargetAssets({
    onSuccess: undefined,
    enabled: true,
  })
  const concentratorsList = useListConcentrators({
    concentratorTargetAssets,
    enabled: true,
  })
  const firstConcentrator = useFirstConcentrator({
    concentratorsList,
    concentratorTargetAsset,
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
}) => {
  const isReady = useClientReady()
  const { isConnected } = useAccount()
  const {
    data: concentratorTargetAssets,
    isLoading: concentratorTargetAssetsIsLoading,
  } = useConcentratorTargetAssets({
    onSuccess: undefined,
    enabled: true,
  })
  const concentratorsList = useListConcentrators({
    concentratorTargetAssets,
    enabled: true,
  })
  const firstConcentratorVaultType = useConcentratorFirstVaultType({
    targetAsset: concentratorTargetAsset,
    enabled: true,
  })
  const ybTokenList = useConcentratorVaultList({
    targetAsset: concentratorTargetAsset,
    primaryAssetList:
      concentratorsList.data?.map((x) => x.vaultAssetAddress) ?? [],
    type: firstConcentratorVaultType ?? "balancer",
  })
  const ybTokenListNonZero = ybTokenList.data?.filter((x) => x !== zeroAddress)
  const rewardsBalance = useConcentratorPendingReward({
    ybTokenList: ybTokenListNonZero ?? [],
  })
  const rewardToken = useTokenOrNative({
    address: concentratorTargetAsset,
  })
  const totalRewards = rewardsBalance.data?.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0n
  )
  return (
    <Skeleton
      isLoading={
        concentratorTargetAssetsIsLoading ||
        concentratorsList.isLoading ||
        rewardsBalance.isLoading ||
        rewardToken.isLoading ||
        !isReady
      }
    >
      {isConnected
        ? formatCurrencyUnits({
            amountWei: (totalRewards ?? 0n).toString(),
            decimals: rewardToken.data?.decimals ?? 18,
            maximumFractionDigits: 4,
          })
        : "—"}
    </Skeleton>
  )
}

const ConcentratorClaimButton: FC<ConcentratorRewardsProps> = ({
  concentratorTargetAsset,
}) => {
  const isReady = useClientReady()
  const { isConnected } = useAccount()
  const {
    data: concentratorTargetAssets,
    isLoading: concentratorTargetAssetsIsLoading,
  } = useConcentratorTargetAssets({
    onSuccess: undefined,
    enabled: true,
  })
  const concentratorsList = useListConcentrators({
    concentratorTargetAssets,
    enabled: true,
  })
  const firstConcentratorVaultType = useConcentratorFirstVaultType({
    targetAsset: concentratorTargetAsset,
    enabled: true,
  })
  const ybTokenList = useConcentratorVaultList({
    targetAsset: concentratorTargetAsset,
    primaryAssetList:
      concentratorsList.data?.map((x) => x.vaultAssetAddress) ?? [],
    type: firstConcentratorVaultType ?? "balancer",
  })
  const ybTokenListNonZero = ybTokenList.data?.filter((x) => x !== zeroAddress)
  const claim = useConcentratorClaim({
    targetAsset: concentratorTargetAsset,
    ybTokenList: ybTokenListNonZero ?? [],
  })
  const rewardsBalance = useConcentratorPendingReward({
    ybTokenList: ybTokenListNonZero ?? [],
  })
  const totalRewards = rewardsBalance.data?.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0n
  )
  return (
    <Button
      className="mt-4 w-full py-2"
      disabled={
        !totalRewards || totalRewards === 0n || !isReady || !isConnected
      }
      isLoading={
        concentratorTargetAssetsIsLoading ||
        concentratorsList.isLoading ||
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
