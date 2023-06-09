import { FC } from "react"

import { calculateAssetsAvailable, ltvPercentage } from "@/lib"
import { formatCurrencyUnits } from "@/lib/helpers"
import { useLendingPair, useLeverPair, useTokenOrNative } from "@/hooks"

import { AssetSymbol } from "@/components/Asset"
import {
  LendingPairAPY,
  LendingPairAPYType,
} from "@/components/LendingPair/LendingPairAPY"
import { LendingPairUtilization } from "@/components/LendingPair/LendingPairUtilization"
import Skeleton from "@/components/Skeleton"

import { LendingPair } from "@/constant"

type LendingPairMetricsProps = LendingPair & {
  apyType: LendingPairAPYType
}

export const LendingPairMetrics: FC<LendingPairMetricsProps> = ({
  apyType,
  ...props
}) => {
  const lendingPair = useLendingPair({
    pairAddress: props.pairAddress,
    chainId: props.chainId,
  })
  return (
    <>
      <h2 className="mb-5 font-display text-2xl lg:text-3xl">Market stats</h2>
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3 lg:gap-6">
          <div className="text-sm uppercase text-white/75">Total borrowed</div>
          <div className="inline-flex gap-2 font-mono lg:text-lg">
            <TotalBorrowed {...props} />
            <AssetSymbol address={lendingPair.data?.assetContract} />
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 lg:gap-6">
          <div className="text-sm uppercase text-white/75">
            Assets available
          </div>
          <div className="inline-flex gap-2 font-mono lg:text-lg">
            <AssetsAvailable {...props} />
            <AssetSymbol address={lendingPair.data?.assetContract} />
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 lg:gap-6">
          <div className="text-sm uppercase text-white/75">Utilization</div>
          <div className="inline-flex gap-2 font-mono lg:text-lg">
            <LendingPairUtilization {...props} />
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 lg:gap-6">
          <div className="text-sm uppercase text-white/75">Max LTV</div>
          <div className="inline-flex gap-2 font-mono lg:text-lg">
            <LendingPairMaxLTV {...props} />
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 lg:gap-6">
          <div className="text-sm uppercase text-white/75">
            {apyType === "borrow" ? "Borrow" : "Lend"} APY
          </div>
          <div className="inline-flex gap-2 font-mono lg:text-lg">
            <LendingPairAPY apyType={apyType} {...props} />
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 lg:gap-6">
          <div className="text-sm uppercase text-white/75">Exchange rate</div>
          <div className="inline-flex gap-2 font-mono lg:text-lg">
            1{" "}
            <AssetSymbol
              address={lendingPair.data?.collateralContract}
              chainId={props.chainId}
            />{" "}
            = <CollateralExchangeRate {...props} />
            <AssetSymbol address={lendingPair.data?.assetContract} />
          </div>
        </div>
      </div>
    </>
  )
}

const TotalBorrowed: FC<LendingPair> = ({ pairAddress, chainId }) => {
  const lendingPair = useLendingPair({ pairAddress, chainId })
  const leverPair = useLeverPair({ pairAddress, chainId })
  const asset = useTokenOrNative({
    address: lendingPair.data?.assetContract,
    chainId,
  })
  return (
    <Skeleton isLoading={leverPair.isLoading} loadingText="...">
      {formatCurrencyUnits({
        amountWei: leverPair.data.totalBorrowAmount?.toString(),
        decimals: asset.data?.decimals,
        maximumFractionDigits: 6,
      })}
    </Skeleton>
  )
}

const AssetsAvailable: FC<LendingPair> = ({ pairAddress, chainId }) => {
  const lendingPair = useLendingPair({ pairAddress, chainId })
  const leverPair = useLeverPair({ pairAddress, chainId })
  const asset = useTokenOrNative({
    address: lendingPair.data?.assetContract,
    chainId,
  })
  return (
    <Skeleton isLoading={leverPair.isLoading} loadingText="...">
      {formatCurrencyUnits({
        amountWei: calculateAssetsAvailable({
          totalAssets: leverPair.data.totalAssets,
          totalBorrowAmount: leverPair.data.totalBorrowAmount,
        }).toString(),
        decimals: asset.data?.decimals,
        maximumFractionDigits: 6,
      })}
    </Skeleton>
  )
}

const LendingPairMaxLTV: FC<LendingPair> = ({ pairAddress, chainId }) => {
  const leverPair = useLeverPair({ pairAddress, chainId })
  return (
    <Skeleton isLoading={leverPair.isLoading} loadingText="...">
      {ltvPercentage(
        leverPair.data.maxLTV,
        leverPair.data.constants?.ltvPrecision
      )}
    </Skeleton>
  )
}

const CollateralExchangeRate: FC<LendingPair> = ({ pairAddress, chainId }) => {
  const lendingPair = useLendingPair({ pairAddress, chainId })
  const leverPair = useLeverPair({ pairAddress, chainId })
  const asset = useTokenOrNative({
    address: lendingPair.data?.assetContract,
    chainId,
  })
  return (
    <Skeleton isLoading={leverPair.isLoading} loadingText="...">
      {formatCurrencyUnits({
        amountWei: leverPair.data.exchangeRate?.toString(),
        decimals: asset.data?.decimals,
        maximumFractionDigits: 6,
      })}
    </Skeleton>
  )
}
