import { FC } from "react"

import { ltvPercentage } from "@/lib"
import { formatCurrencyUnits } from "@/lib/helpers"
import { useLendingPair, usePairLeverParams, useTokenOrNative } from "@/hooks"

import { AssetSymbol } from "@/components/Asset"
import { LendingPairAPY } from "@/components/LendingPair/LendingPairAPY"
import { LendingPairUtilization } from "@/components/LendingPair/LendingPairUtilization"
import Skeleton from "@/components/Skeleton"

import { LendingPair } from "@/constant"

export const LendingPairStats: FC<LendingPair> = (props) => {
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
          <div className="text-sm uppercase text-white/75">APY</div>
          <div className="inline-flex gap-2 font-mono lg:text-lg">
            <LendingPairAPY {...props} />
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 lg:gap-6">
          <div className="text-sm uppercase text-white/75">Exchange rate</div>
          <div className="inline-flex gap-2 font-mono lg:text-lg">
            <CollateralExchangeRate {...props} />
            <AssetSymbol address={lendingPair.data?.assetContract} />
          </div>
        </div>
      </div>
    </>
  )
}

const TotalBorrowed: FC<LendingPair> = ({ pairAddress, chainId }) => {
  const lendingPair = useLendingPair({ pairAddress, chainId })
  const pairLeverParams = usePairLeverParams({ pairAddress, chainId })
  const asset = useTokenOrNative({
    address: lendingPair.data?.assetContract,
    chainId,
  })
  return (
    <Skeleton isLoading={pairLeverParams.isLoading} loadingText="...">
      {formatCurrencyUnits({
        amountWei: pairLeverParams.data.totalBorrowAmount?.toString(),
        decimals: asset.data?.decimals,
        maximumFractionDigits: 6,
      })}
    </Skeleton>
  )
}

const AssetsAvailable: FC<LendingPair> = ({ pairAddress, chainId }) => {
  const lendingPair = useLendingPair({ pairAddress, chainId })
  const pairLeverParams = usePairLeverParams({ pairAddress, chainId })
  const asset = useTokenOrNative({
    address: lendingPair.data?.assetContract,
    chainId,
  })
  return (
    <Skeleton isLoading={pairLeverParams.isLoading} loadingText="...">
      {formatCurrencyUnits({
        amountWei: pairLeverParams.data.totalAssets
          ?.sub(pairLeverParams.data.totalBorrowAmount ?? 0)
          .toString(),
        decimals: asset.data?.decimals,
        maximumFractionDigits: 6,
      })}
    </Skeleton>
  )
}

const LendingPairMaxLTV: FC<LendingPair> = ({ pairAddress, chainId }) => {
  const pairLeverParams = usePairLeverParams({ pairAddress, chainId })
  return (
    <Skeleton isLoading={pairLeverParams.isLoading} loadingText="...">
      {ltvPercentage(
        pairLeverParams.data.maxLTV,
        pairLeverParams.data.constants?.ltvPrecision
      )}
    </Skeleton>
  )
}

const CollateralExchangeRate: FC<LendingPair> = ({ pairAddress, chainId }) => {
  const lendingPair = useLendingPair({ pairAddress, chainId })
  const pairLeverParams = usePairLeverParams({ pairAddress, chainId })
  const asset = useTokenOrNative({
    address: lendingPair.data?.assetContract,
    chainId,
  })
  return (
    <Skeleton isLoading={pairLeverParams.isLoading} loadingText="...">
      {formatCurrencyUnits({
        amountWei: pairLeverParams.data.exchangeRate?.toString(),
        decimals: asset.data?.decimals,
        maximumFractionDigits: 6,
      })}
    </Skeleton>
  )
}
