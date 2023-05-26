import * as Tabs from "@radix-ui/react-tabs"
import { GetStaticPaths, GetStaticProps, NextPage } from "next"
import Link from "next/link"
import { useEffect, useState } from "react"
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
import { TxSettingsPopover } from "@/components/TxSettingsPopover"

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

const LeverPairDetail: NextPage<LendingPair> = (props) => {
  const [isLevered, setIsLevered] = useState(false)
  const [isUpdatingAmounts, setIsUpdatingAmounts] = useState(false)
  const [adjustedBorrowAmount, setAdjustedBorrowAmount] = useState<bigint>()
  const [adjustedCollateralAmount, setAdjustedCollateralAmount] =
    useState<bigint>()

  const isClientReady = useClientReady()
  const lendingPair = useLendingPair(props)
  const pairLeverParams = usePairLeverParams(props)
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
    chainId: props.chainId,
  })
  const collateralAssetBalance = useTokenOrNativeBalance({
    address: lendingPair.data?.collateralContract,
    chainId: props.chainId,
  })

  const onSuccess = () => {
    pairLeverParams.refetch()
    borrowAssetBalance.refetch()
    collateralAssetBalance.refetch()
  }

  // manually manage the available lever tabs
  // when lending data is refetched, borrowAmountSignificant will change value, causing UI flashing to occur
  // we don't want to change the view unless the condition has truly changed and is not just undefined during refetch
  useEffect(() => {
    if (isClientReady) {
      if (borrowAmountSignificant > 0 || collateralAmountSignificant > 0) {
        if (!isLevered) setIsLevered(true)
      } else if (isLevered) {
        setIsLevered(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isClientReady,
    borrowAmountSignificant,
    collateralAmountSignificant,
    pairLeverParams.data.borrowedAmount,
    pairLeverParams.data.collateralAmount,
  ])

  return (
    <DisabledPage isDisabled={DISABLE_LENDING}>
      <Layout>
        <Seo templateTitle={`${props.collateralTokenSymbol} | Lever`} />

        <div className="grid gap-4 lg:grid-cols-[1fr,3fr] lg:gap-6">
          <aside className="max-lg:hidden">
            <LeverPairs />
          </aside>

          <main className="rounded-lg bg-pink-900/80 p-3 backdrop-blur-md lg:p-6">
            <header className="mb-3">
              <div className="flex justify-between">
                <Link
                  {...resolvedRoute("/app/lever")}
                  className="flex items-center gap-2 text-sm font-medium uppercase text-pink-100"
                >
                  <FiArrowLeft className="h-4 w-4" />
                  Lever
                </Link>
                <TxSettingsPopover className="max-md:hidden" />
              </div>

              <h1 className="mt-3 flex items-center gap-3 font-display text-3xl lg:text-4xl">
                <AssetLogo
                  chainId={props.chainId}
                  className="h-8 w-8"
                  tokenAddress={lendingPair.data?.collateralContract}
                />
                {props.collateralTokenName}
              </h1>
            </header>
            <div className="mt-4 lg:mt-6">
              <div className="-mx-4 mt-4 border-t border-t-pink/30 px-4 pt-4 lg:-mx-6 lg:mt-6 lg:px-6 lg:pt-6">
                <Tabs.Root defaultValue="create">
                  <Tabs.List className="-mx-3 -mt-4 flex divide-x divide-pink/30 border-b border-pink/30 lg:-mx-6 lg:-mt-6">
                    <Tabs.Trigger
                      value="create"
                      className="transition-color group h-14 w-1/3 px-3 text-xs font-semibold uppercase text-pink-100/50 duration-200 ease-linear disabled:cursor-not-allowed ui-state-active:bg-pink/10 ui-state-active:text-orange-400"
                    >
                      <span className="group-disabled:opacity-25">Lever</span>
                    </Tabs.Trigger>
                    <Tabs.Trigger
                      value="repay"
                      className="transition-color group h-14 w-1/3 px-3 text-xs font-semibold uppercase text-pink-100/50 duration-200 ease-linear disabled:cursor-not-allowed ui-state-active:bg-pink/10 ui-state-active:text-orange-400"
                      disabled={!isLevered}
                    >
                      <span className="group-disabled:opacity-25">Repay</span>
                    </Tabs.Trigger>
                    <Tabs.Trigger
                      value="manageCollateral"
                      className="transition-color group h-14 w-1/3 px-3 text-xs font-semibold uppercase text-pink-100/50 duration-200 ease-linear disabled:cursor-not-allowed ui-state-active:bg-pink/10 ui-state-active:text-orange-400"
                      disabled={!isLevered}
                    >
                      <span className="group-disabled:opacity-25">
                        Collateral
                      </span>
                    </Tabs.Trigger>
                  </Tabs.List>
                  <div className="relative overflow-hidden">
                    <Tabs.Content
                      className="pt-3 ui-state-active:animate-scale-in ui-state-inactive:absolute ui-state-inactive:inset-0 ui-state-inactive:animate-scale-out lg:pt-6"
                      value="create"
                    >
                      <CreateLeverPosition
                        chainId={props.chainId}
                        borrowAssetAddress={lendingPair.data?.assetContract}
                        collateralAssetAddress={
                          lendingPair.data?.collateralContract
                        }
                        collateralAssetBalance={collateralAssetBalance}
                        adjustedBorrowAmount={adjustedBorrowAmount}
                        adjustedCollateralAmount={adjustedCollateralAmount}
                        isUpdatingAmounts={isUpdatingAmounts}
                        setAdjustedBorrowAmount={setAdjustedBorrowAmount}
                        setAdjustedCollateralAmount={
                          setAdjustedCollateralAmount
                        }
                        setIsUpdatingAmounts={setIsUpdatingAmounts}
                        pairAddress={props.pairAddress}
                        onSuccess={onSuccess}
                      />
                    </Tabs.Content>
                    <Tabs.Content
                      className="pt-3 ui-state-active:animate-scale-in ui-state-inactive:absolute ui-state-inactive:inset-0 ui-state-inactive:animate-scale-out lg:pt-6"
                      value="repay"
                    >
                      <RepayLeverPosition
                        chainId={props.chainId}
                        borrowAmountSignificant={borrowAmountSignificant}
                        borrowAssetAddress={lendingPair.data?.assetContract}
                        borrowAssetBalance={borrowAssetBalance}
                        collateralAmountSignificant={
                          collateralAmountSignificant
                        }
                        collateralAssetAddress={
                          lendingPair.data?.collateralContract
                        }
                        collateralAssetBalance={collateralAssetBalance}
                        isUpdatingAmounts={isUpdatingAmounts}
                        setAdjustedBorrowAmount={setAdjustedBorrowAmount}
                        setAdjustedCollateralAmount={
                          setAdjustedCollateralAmount
                        }
                        setIsUpdatingAmounts={setIsUpdatingAmounts}
                        pairAddress={props.pairAddress}
                        onSuccess={onSuccess}
                      />
                    </Tabs.Content>
                    <Tabs.Content
                      className="pt-3 ui-state-active:animate-scale-in ui-state-inactive:absolute ui-state-inactive:inset-0 ui-state-inactive:animate-scale-out lg:pt-6"
                      value="manageCollateral"
                    >
                      {/* TODO: Switch to add/remove */}
                      <AddCollateral
                        chainId={props.chainId}
                        collateralAssetAddress={
                          lendingPair.data?.collateralContract
                        }
                        collateralAssetBalance={collateralAssetBalance}
                        collateralAmountSignificant={
                          collateralAmountSignificant
                        }
                        isUpdatingAmounts={isUpdatingAmounts}
                        setAdjustedCollateralAmount={
                          setAdjustedCollateralAmount
                        }
                        setIsUpdatingAmounts={setIsUpdatingAmounts}
                        pairAddress={props.pairAddress}
                        onSuccess={onSuccess}
                      />
                      <RemoveCollateral
                        chainId={props.chainId}
                        collateralAssetAddress={
                          lendingPair.data?.collateralContract
                        }
                        collateralAssetBalance={collateralAssetBalance}
                        collateralAmountSignificant={
                          collateralAmountSignificant
                        }
                        isUpdatingAmounts={isUpdatingAmounts}
                        setAdjustedCollateralAmount={
                          setAdjustedCollateralAmount
                        }
                        setIsUpdatingAmounts={setIsUpdatingAmounts}
                        pairAddress={props.pairAddress}
                        onSuccess={onSuccess}
                      />
                    </Tabs.Content>
                  </div>
                </Tabs.Root>
              </div>
              <div className="-mx-4 mt-4 border-t border-t-pink/30 px-4 pt-4 lg:-mx-6 lg:mt-6 lg:px-6 lg:pt-6">
                <LeverPositionUserStats
                  {...props}
                  adjustedBorrowAmount={adjustedBorrowAmount}
                  adjustedCollateralAmount={adjustedCollateralAmount}
                  isUpdatingAmounts={isUpdatingAmounts}
                />
              </div>
              <div className="-mx-4 mt-4 border-t border-t-pink/30 px-4 pt-4 lg:-mx-6 lg:mt-6 lg:px-6 lg:pt-6">
                <LendingPairStats apyType="borrow" {...props} />
              </div>
            </div>
          </main>
        </div>
      </Layout>
    </DisabledPage>
  )
}

export default LeverPairDetail
