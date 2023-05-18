import * as Tabs from "@radix-ui/react-tabs"
import { BigNumber } from "ethers"
import { GetStaticPaths, GetStaticProps, NextPage } from "next"
import Link from "next/link"
import { Dispatch, FC, SetStateAction, useState } from "react"
import { FiArrowLeft } from "react-icons/fi"

import { resolvedRoute } from "@/lib/helpers"
import {
  useClientReady,
  useLendingPair,
  usePairLeverParams,
  useSignificantLeverAmount,
  useTokenOrNativeBalance,
} from "@/hooks"

import { DisabledPage } from "@/components"
import { AssetLogo } from "@/components/Asset"
import Layout from "@/components/Layout"
import { LendingPairStats } from "@/components/LendingPair"
import {
  AddCollateral,
  CreateLeverPosition,
  LeverPairs,
  LeverPositionUserStats,
  RemoveCollateral,
  RepayLeverPosition,
} from "@/components/LeverPosition"
import Seo from "@/components/Seo"

import { LendingPair, lendingPairs } from "@/constant"
import { DISABLE_LENDING } from "@/constant/env"

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: lendingPairs.map((pair) => ({
      params: { pairAddress: pair.pairAddress },
    })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = (context) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const lendingPair = lendingPairs.find(
    (p) => p.pairAddress === context.params?.pairAddress
  )!
  return { props: lendingPair }
}

const LeverPairDetail: NextPage<LendingPair> = (lendingPair) => {
  const [isUpdatingAmounts, setIsUpdatingAmounts] = useState(false)
  const [adjustedBorrowAmount, setAdjustedBorrowAmount] = useState<BigNumber>()
  const [adjustedCollateralAmount, setAdjustedCollateralAmount] =
    useState<BigNumber>()

  return (
    <DisabledPage isDisabled={DISABLE_LENDING}>
      <Layout>
        <Seo templateTitle={`${lendingPair.collateralTokenSymbol} | Lever`} />

        <div className="grid gap-4 lg:grid-cols-[1fr,3fr] lg:gap-6">
          <aside className="max-lg:hidden">
            <LeverPairs />
          </aside>

          <main className="rounded-lg bg-pink-900/80 p-3 backdrop-blur-md lg:p-6">
            <header className="mb-3">
              <Link
                {...resolvedRoute("/app/lever")}
                className="flex items-center gap-2 text-sm font-medium uppercase text-pink-100"
              >
                <FiArrowLeft className="h-4 w-4" />
                Lever
              </Link>
              <h1 className="mt-3 font-display text-3xl lg:text-4xl">
                <LeverPairHeading {...lendingPair} />
              </h1>
            </header>
            <div className="mt-4 lg:mt-6">
              <div className="-mx-4 mt-4 border-t border-t-pink/30 px-4 pt-4 lg:-mx-6 lg:mt-6 lg:px-6 lg:pt-6">
                <ActiveLeverControls
                  {...lendingPair}
                  adjustedBorrowAmount={adjustedBorrowAmount}
                  isUpdatingAmounts={isUpdatingAmounts}
                  setAdjustedBorrowAmount={setAdjustedBorrowAmount}
                  setAdjustedCollateralAmount={setAdjustedCollateralAmount}
                  setIsUpdatingAmounts={setIsUpdatingAmounts}
                />
              </div>
              <div className="-mx-4 mt-4 border-t border-t-pink/30 px-4 pt-4 lg:-mx-6 lg:mt-6 lg:px-6 lg:pt-6">
                <LeverPositionUserStats
                  {...lendingPair}
                  adjustedBorrowAmount={adjustedBorrowAmount}
                  adjustedCollateralAmount={adjustedCollateralAmount}
                  isUpdatingAmounts={isUpdatingAmounts}
                />
              </div>
              <div className="-mx-4 mt-4 border-t border-t-pink/30 px-4 pt-4 lg:-mx-6 lg:mt-6 lg:px-6 lg:pt-6">
                <LendingPairStats apyType="borrow" {...lendingPair} />
              </div>
            </div>
          </main>
        </div>
      </Layout>
    </DisabledPage>
  )
}

export default LeverPairDetail

const LeverPairHeading: FC<LendingPair> = ({
  collateralTokenName,
  chainId,
  pairAddress,
}) => {
  const lendingPair = useLendingPair({ pairAddress, chainId })
  return (
    <div className="flex items-center gap-3">
      <AssetLogo
        chainId={chainId}
        className="h-8 w-8"
        tokenAddress={lendingPair.data?.collateralContract}
      />
      {collateralTokenName}
    </div>
  )
}

type ActiveLeverControlsProps = LendingPair & {
  adjustedBorrowAmount?: BigNumber
  isUpdatingAmounts: boolean
  setAdjustedBorrowAmount: Dispatch<SetStateAction<BigNumber | undefined>>
  setAdjustedCollateralAmount: Dispatch<SetStateAction<BigNumber | undefined>>
  setIsUpdatingAmounts: Dispatch<SetStateAction<boolean>>
}

const ActiveLeverControls: FC<ActiveLeverControlsProps> = ({
  chainId,
  pairAddress,
  adjustedBorrowAmount,
  isUpdatingAmounts,
  setAdjustedBorrowAmount,
  setAdjustedCollateralAmount,
  setIsUpdatingAmounts,
}) => {
  const isClientReady = useClientReady()
  const lendingPair = useLendingPair({ chainId, pairAddress })
  const pairLeverParams = usePairLeverParams({ chainId, pairAddress })
  const borrowAmountSignificant = useSignificantLeverAmount({
    amount: pairLeverParams.data.borrowedAmount,
    assetAddress: lendingPair.data?.assetContract,
  })
  const collateralAmountSignificant = useSignificantLeverAmount({
    amount: pairLeverParams.data.collateralAmount,
    assetAddress: lendingPair.data?.collateralContract,
  })
  const borrowAssetBalance = useTokenOrNativeBalance({
    address: lendingPair.data?.assetContract,
    chainId,
  })
  const collateralAssetBalance = useTokenOrNativeBalance({
    address: lendingPair.data?.collateralContract,
    chainId,
  })

  const onSuccess = () => {
    pairLeverParams.refetch()
    borrowAssetBalance.refetch()
    collateralAssetBalance.refetch()
  }

  return isClientReady ? (
    borrowAmountSignificant.gt(0) ? (
      <Tabs.Root defaultValue="repay">
        <Tabs.List className="-mx-3 -mt-4 flex divide-x divide-pink/30 border-b border-pink/30 lg:-mx-6 lg:-mt-6">
          <Tabs.Trigger
            value="repay"
            className="transition-color h-14 w-1/3 px-3 text-xs font-semibold uppercase text-pink-100/50 duration-200 ease-linear ui-state-active:bg-pink/10 ui-state-active:text-orange-400"
          >
            Repay
          </Tabs.Trigger>
          <Tabs.Trigger
            value="addCollateral"
            className="transition-color h-14 w-1/3 px-3 text-xs font-semibold uppercase text-pink-100/50 duration-200 ease-linear ui-state-active:bg-pink/10 ui-state-active:text-orange-400"
          >
            Add collateral
          </Tabs.Trigger>
          <Tabs.Trigger
            value="removeCollateral"
            className="transition-color h-14 w-1/3 px-3 text-xs font-semibold uppercase text-pink-100/50 duration-200 ease-linear ui-state-active:bg-pink/10 ui-state-active:text-orange-400"
          >
            Remove collateral
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content className="pt-3 lg:pt-6" value="repay">
          <RepayLeverPosition
            chainId={chainId}
            borrowAmountSignificant={borrowAmountSignificant}
            borrowAssetAddress={lendingPair.data?.assetContract}
            borrowAssetBalance={borrowAssetBalance}
            collateralAmountSignificant={collateralAmountSignificant}
            collateralAssetAddress={lendingPair.data?.collateralContract}
            collateralAssetBalance={collateralAssetBalance}
            isUpdatingAmounts={isUpdatingAmounts}
            setAdjustedBorrowAmount={setAdjustedBorrowAmount}
            setAdjustedCollateralAmount={setAdjustedCollateralAmount}
            setIsUpdatingAmounts={setIsUpdatingAmounts}
            pairAddress={pairAddress}
            onSuccess={onSuccess}
          />
        </Tabs.Content>
        <Tabs.Content className="pt-3 lg:pt-6" value="addCollateral">
          <AddCollateral
            chainId={chainId}
            collateralAssetAddress={lendingPair.data?.collateralContract}
            collateralAssetBalance={collateralAssetBalance}
            collateralAmountSignificant={collateralAmountSignificant}
            isUpdatingAmounts={isUpdatingAmounts}
            setAdjustedCollateralAmount={setAdjustedCollateralAmount}
            setIsUpdatingAmounts={setIsUpdatingAmounts}
            pairAddress={pairAddress}
            onSuccess={onSuccess}
          />
        </Tabs.Content>
        <Tabs.Content className="pt-3 lg:pt-6" value="removeCollateral">
          <RemoveCollateral
            chainId={chainId}
            collateralAssetAddress={lendingPair.data?.collateralContract}
            collateralAssetBalance={collateralAssetBalance}
            collateralAmountSignificant={collateralAmountSignificant}
            isUpdatingAmounts={isUpdatingAmounts}
            setAdjustedCollateralAmount={setAdjustedCollateralAmount}
            setIsUpdatingAmounts={setIsUpdatingAmounts}
            pairAddress={pairAddress}
            onSuccess={onSuccess}
          />
        </Tabs.Content>
      </Tabs.Root>
    ) : (
      <CreateLeverPosition
        chainId={chainId}
        borrowAssetAddress={lendingPair.data?.assetContract}
        collateralAssetAddress={lendingPair.data?.collateralContract}
        collateralAssetBalance={collateralAssetBalance}
        adjustedBorrowAmount={adjustedBorrowAmount}
        isUpdatingAmounts={isUpdatingAmounts}
        setAdjustedBorrowAmount={setAdjustedBorrowAmount}
        setAdjustedCollateralAmount={setAdjustedCollateralAmount}
        setIsUpdatingAmounts={setIsUpdatingAmounts}
        pairAddress={pairAddress}
        onSuccess={onSuccess}
      />
    )
  ) : null
}
