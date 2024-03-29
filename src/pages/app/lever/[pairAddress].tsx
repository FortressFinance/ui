import * as Tabs from "@radix-ui/react-tabs"
import { GetStaticPaths, GetStaticProps, NextPage } from "next"
import Link from "next/link"
import { useEffect, useState } from "react"
import { FiArrowLeft } from "react-icons/fi"

import clsxm from "@/lib/clsxm"
import { resolvedRoute } from "@/lib/helpers"
import {
  useClientReady,
  useLendingPair,
  useLeverPair,
  useSignificantLeverAmount,
  useTokenOrNativeBalance,
} from "@/hooks"

import { DisabledPage, ViewContractOnExplorer } from "@/components"
import { AssetLogo } from "@/components/Asset"
import Button from "@/components/Button"
import Layout from "@/components/Layout"
import { LendingPairMetrics } from "@/components/LendingPair"
import {
  AddCollateral,
  CreateLeverPosition,
  LeverPairs,
  LeverPositionUserMetrics,
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
  const [activeTab, setActiveTab] = useState("create")
  const [activeCollateralTab, setActiveCollateralTab] = useState("add")
  const [isAccountLocked, setIsAccountLocked] = useState(false)
  const [isLevered, setIsLevered] = useState(false)
  const [isUpdatingAmounts, setIsUpdatingAmounts] = useState(false)
  const [estimatedBorrowAmount, setEstimatedBorrowAmount] = useState<bigint>()
  const [estimatedCollateralAmount, setEstimatedCollateralAmount] =
    useState<bigint>()

  const isClientReady = useClientReady()
  const lendingPair = useLendingPair(props)
  const leverPair = useLeverPair(props)
  const borrowAmountSignificant = useSignificantLeverAmount({
    amount: leverPair.data.borrowedAmount,
    assetAddress: lendingPair.data?.assetContract,
  })
  const collateralAmountSignificant = useSignificantLeverAmount({
    amount: leverPair.data.collateralAmount,
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
    leverPair.refetch()
    borrowAssetBalance.refetch()
    collateralAssetBalance.refetch()
    // lock UI to prevent speedbump errors if users attempt multiple txs in quick succession
    setIsAccountLocked(true)
    setTimeout(() => setIsAccountLocked(false), 15000)
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
        setActiveTab("create")
        setActiveCollateralTab("add")
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isClientReady,
    borrowAmountSignificant,
    collateralAmountSignificant,
    leverPair.data.borrowedAmount,
    leverPair.data.collateralAmount,
  ])

  const CollateralTabsList = () => (
    <Tabs.List className="flex h-12 w-full shrink-0 justify-center gap-1.5 md:w-1/2">
      <Tabs.Trigger value="add" asChild>
        <Button
          variant="outline"
          className="w-full text-sm ui-state-active:bg-pink/50"
        >
          Deposit
        </Button>
      </Tabs.Trigger>
      <Tabs.Trigger value="remove" asChild>
        <Button
          variant="outline"
          className="w-full text-sm ui-state-active:bg-pink/50"
        >
          Withdraw
        </Button>
      </Tabs.Trigger>
    </Tabs.List>
  )

  return (
    <DisabledPage isDisabled={DISABLE_LENDING}>
      <Layout>
        <Seo templateTitle={`${props.name} | Lever`} />

        <div className="grid gap-4 lg:grid-cols-[1fr,3fr] lg:gap-6">
          <aside className="max-lg:hidden">
            <LeverPairs />
          </aside>

          <main className="rounded-lg bg-pink-900/80 p-3 backdrop-blur-md lg:p-6">
            <header className="mb-3">
              <div className="flex justify-between">
                <Link
                  {...resolvedRoute("/app/lever")}
                  className="inline-flex items-center gap-2 text-sm font-medium uppercase text-pink-100"
                >
                  <FiArrowLeft className="h-4 w-4" />
                  Lever
                </Link>
                <div className="flex items-center gap-4">
                  <ViewContractOnExplorer
                    chainId={props.chainId}
                    className="h-5 w-5"
                    contractAddress={props.pairAddress}
                  />
                  <TxSettingsPopover className="max-md:hidden" />
                </div>
              </div>

              <div className="mt-3 flex items-center gap-3">
                <AssetLogo
                  chainId={props.chainId}
                  className="h-8 w-8"
                  tokenAddress={lendingPair.data?.collateralContract}
                />
                <h1 className="font-display text-3xl lg:text-4xl">
                  {props.name}
                </h1>
                <span
                  className={clsxm(
                    "translate-y-px rounded border border-orange-400/50 bg-orange-400/20 p-1.5 px-2 text-xs text-orange-400 opacity-0 transition-opacity duration-200",
                    { "opacity-100": isAccountLocked }
                  )}
                  aria-hidden={isAccountLocked ? "false" : "true"}
                >
                  15s <span className="uppercase">update-lock</span>
                </span>
              </div>
            </header>
            <div className="mt-4 lg:mt-6">
              <div className="-mx-4 mt-4 border-t border-t-pink/30 px-4 pt-4 lg:-mx-6 lg:mt-6 lg:px-6 lg:pt-6">
                <Tabs.Root
                  value={activeTab}
                  onValueChange={(value) => {
                    const prevActiveTab = activeTab
                    setActiveTab(value)
                    if (prevActiveTab === "collateral") {
                      // Wait 400ms for the tab to animate out, then reset collateral sub-tab
                      setTimeout(() => setActiveCollateralTab("add"), 400)
                    }
                  }}
                >
                  <Tabs.List className="-mx-3 -mt-4 flex divide-x divide-pink/30 border-b border-pink/30 lg:-mx-6 lg:-mt-6">
                    <Tabs.Trigger
                      value="create"
                      className="transition-color group h-14 w-1/3 px-3 text-xs font-semibold uppercase text-pink-100/50 duration-200 ease-linear disabled:cursor-not-allowed ui-state-active:bg-pink/10 ui-state-active:text-orange-400"
                      disabled={isAccountLocked}
                    >
                      <span className="group-disabled:opacity-25">Lever</span>
                    </Tabs.Trigger>
                    <Tabs.Trigger
                      value="repay"
                      className="transition-color group h-14 w-1/3 px-3 text-xs font-semibold uppercase text-pink-100/50 duration-200 ease-linear disabled:cursor-not-allowed ui-state-active:bg-pink/10 ui-state-active:text-orange-400"
                      disabled={!isLevered || isAccountLocked}
                    >
                      <span className="group-disabled:opacity-25">Repay</span>
                    </Tabs.Trigger>
                    <Tabs.Trigger
                      value="collateral"
                      className="transition-color group h-14 w-1/3 px-3 text-xs font-semibold uppercase text-pink-100/50 duration-200 ease-linear disabled:cursor-not-allowed ui-state-active:bg-pink/10 ui-state-active:text-orange-400"
                      disabled={!isLevered || isAccountLocked}
                    >
                      <span className="group-disabled:opacity-25">
                        Collateral
                      </span>
                    </Tabs.Trigger>
                  </Tabs.List>
                  <div className="relative overflow-hidden">
                    <Tabs.Content
                      className={clsxm(
                        "pt-3 transition-opacity duration-200 ui-state-active:animate-scale-in ui-state-inactive:absolute ui-state-inactive:inset-0 ui-state-inactive:animate-scale-out lg:pt-6",
                        {
                          "opacity-50 after:absolute after:inset-0 after:z-10 after:cursor-not-allowed":
                            isAccountLocked,
                        }
                      )}
                      value="create"
                    >
                      <CreateLeverPosition
                        chainId={props.chainId}
                        borrowAssetAddress={lendingPair.data?.assetContract}
                        collateralAssetAddress={
                          lendingPair.data?.collateralContract
                        }
                        underlyingAssetAddress={props.underlyingAssetAddress}
                        collateralAssetBalance={collateralAssetBalance}
                        isUpdatingAmounts={isUpdatingAmounts}
                        setEstimatedBorrowAmount={setEstimatedBorrowAmount}
                        setEstimatedCollateralAmount={
                          setEstimatedCollateralAmount
                        }
                        setIsUpdatingAmounts={setIsUpdatingAmounts}
                        pairAddress={props.pairAddress}
                        onSuccess={onSuccess}
                      />
                    </Tabs.Content>
                    <Tabs.Content
                      className={clsxm(
                        "pt-3 transition-opacity duration-200 ui-state-active:animate-scale-in ui-state-inactive:absolute ui-state-inactive:inset-0 ui-state-inactive:animate-scale-out lg:pt-6",
                        {
                          "opacity-50 after:absolute after:inset-0 after:z-10 after:cursor-not-allowed":
                            isAccountLocked,
                        }
                      )}
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
                        underlyingAssetAddress={props.underlyingAssetAddress}
                        isUpdatingAmounts={isUpdatingAmounts}
                        setEstimatedBorrowAmount={setEstimatedBorrowAmount}
                        setEstimatedCollateralAmount={
                          setEstimatedCollateralAmount
                        }
                        setIsUpdatingAmounts={setIsUpdatingAmounts}
                        pairAddress={props.pairAddress}
                        onSuccess={onSuccess}
                      />
                    </Tabs.Content>
                    <Tabs.Content
                      className={clsxm(
                        "pt-3 transition-opacity duration-200 ui-state-active:animate-scale-in ui-state-inactive:absolute ui-state-inactive:inset-0 ui-state-inactive:animate-scale-out lg:pt-6",
                        {
                          "opacity-50 after:absolute after:inset-0 after:z-10 after:cursor-not-allowed":
                            isAccountLocked,
                        }
                      )}
                      value="collateral"
                    >
                      <Tabs.Root
                        className="relative"
                        value={activeCollateralTab}
                        onValueChange={setActiveCollateralTab}
                      >
                        <Tabs.Content
                          value="add"
                          className="ui-state-active:animate-scale-in ui-state-inactive:absolute ui-state-inactive:inset-0 ui-state-inactive:animate-scale-out"
                        >
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
                            setEstimatedCollateralAmount={
                              setEstimatedCollateralAmount
                            }
                            setIsUpdatingAmounts={setIsUpdatingAmounts}
                            pairAddress={props.pairAddress}
                            onSuccess={onSuccess}
                            tabsList={<CollateralTabsList />}
                          />
                        </Tabs.Content>
                        <Tabs.Content
                          value="remove"
                          className="ui-state-active:animate-scale-in ui-state-inactive:absolute ui-state-inactive:inset-0 ui-state-inactive:animate-scale-out"
                        >
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
                            setEstimatedCollateralAmount={
                              setEstimatedCollateralAmount
                            }
                            setIsUpdatingAmounts={setIsUpdatingAmounts}
                            pairAddress={props.pairAddress}
                            onSuccess={onSuccess}
                            tabsList={<CollateralTabsList />}
                          />
                        </Tabs.Content>
                      </Tabs.Root>
                    </Tabs.Content>
                  </div>
                </Tabs.Root>
              </div>
              <div className="-mx-4 mt-4 border-t border-t-pink/30 px-4 pt-4 lg:-mx-6 lg:mt-6 lg:px-6 lg:pt-6">
                <LeverPositionUserMetrics
                  {...props}
                  estimatedBorrowAmount={estimatedBorrowAmount}
                  estimatedCollateralAmount={estimatedCollateralAmount}
                  borrowAmountSignificant={borrowAmountSignificant}
                  collateralAmountSignificant={collateralAmountSignificant}
                  isUpdatingAmounts={isUpdatingAmounts}
                />
              </div>
              <div className="-mx-4 mt-4 border-t border-t-pink/30 px-4 pt-4 lg:-mx-6 lg:mt-6 lg:px-6 lg:pt-6">
                <LendingPairMetrics interestType="borrow" {...props} />
              </div>
            </div>
          </main>
        </div>
      </Layout>
    </DisabledPage>
  )
}

export default LeverPairDetail
