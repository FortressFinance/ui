import * as Tabs from "@radix-ui/react-tabs"
import { NextPage } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { FC } from "react"
import { FiArrowLeft } from "react-icons/fi"
import { Address, useAccount } from "wagmi"

import { ltvPercentage } from "@/lib"
import { formatCurrencyUnits, resolvedRoute } from "@/lib/helpers"
import {
  useClientReady,
  useConvertToAssets,
  useLendingPair,
  usePairLeverParams,
  useTokenOrNative,
  useTokenOrNativeBalance,
} from "@/hooks"

import { DisabledPage } from "@/components"
import { AssetBalance, AssetLogo, AssetSymbol } from "@/components/Asset"
import Layout from "@/components/Layout"
import {
  LendingPairAPY,
  LendingPairDepositForm,
  LendingPairRedeem,
  LendingPairUtilization,
} from "@/components/LendingPair"
import Seo from "@/components/Seo"
import Skeleton from "@/components/Skeleton"

import { LendingPair, lendingPairs } from "@/constant"
import { DISABLE_LENDING } from "@/constant/env"

const LendingPairDetail: NextPage = () => {
  const router = useRouter()
  const isClientReady = useClientReady()
  const pairAddress = router.query.pairAddress as Address
  const lendingPair = lendingPairs.find((p) => p.pairAddress === pairAddress)

  return (
    <DisabledPage isDisabled={DISABLE_LENDING}>
      <Layout>
        {isClientReady ? (
          lendingPair ? (
            <>
              <LendingPairSeo {...lendingPair} />

              <main className="grid gap-4 lg:grid-cols-[2fr,1fr] lg:gap-6">
                <div className="rounded-lg bg-pink-900/80 p-4 backdrop-blur-md lg:p-6">
                  <header>
                    <Link
                      {...resolvedRoute("/app/lend")}
                      className="flex items-center gap-2 text-sm font-medium uppercase text-pink-100"
                    >
                      <FiArrowLeft className="h-4 w-4" />
                      Lend
                    </Link>
                    <h1 className="mt-3 font-display text-3xl lg:text-4xl">
                      <LendingPairHeading {...lendingPair} />
                    </h1>
                  </header>
                  <p className="mt-3 leading-relaxed text-white/75 lg:text-lg">
                    Put your <LendingPairAsset {...lendingPair} /> to work in
                    the Fortress Lending markets.
                  </p>
                  <div className="-mx-4 mt-4 border-t border-t-pink/30 px-4 pt-4 lg:-mx-6 lg:mt-6 lg:px-6 lg:pt-6">
                    <h2 className="mb-5 font-display text-2xl lg:text-3xl">
                      Your position
                    </h2>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-3 lg:gap-6">
                        <div className="text-sm uppercase text-white/75">
                          Assets lent
                        </div>
                        <div className="inline-flex gap-2 font-mono lg:text-lg">
                          <UserAssetsLent {...lendingPair} />
                          <LendingPairAsset {...lendingPair} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-3 lg:gap-6">
                        <div className="text-sm uppercase text-white/75">
                          Shares
                        </div>
                        <div className="inline-flex gap-2 font-mono lg:text-lg">
                          <AssetBalance address={pairAddress} abbreviate />
                          <AssetSymbol
                            address={pairAddress}
                            chainId={lendingPair.chainId}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="-mx-4 mt-4 border-t border-t-pink/30 px-4 pt-4 lg:-mx-6 lg:mt-6 lg:px-6 lg:pt-6">
                    <h2 className="mb-5 font-display text-2xl lg:text-3xl">
                      Market stats
                    </h2>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-3 lg:gap-6">
                        <div className="text-sm uppercase text-white/75">
                          Total borrowed
                        </div>
                        <div className="inline-flex gap-2 font-mono lg:text-lg">
                          <TotalBorrowed {...lendingPair} />
                          <LendingPairAsset {...lendingPair} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-3 lg:gap-6">
                        <div className="text-sm uppercase text-white/75">
                          Assets available
                        </div>
                        <div className="inline-flex gap-2 font-mono lg:text-lg">
                          <AssetsAvailable {...lendingPair} />
                          <LendingPairAsset {...lendingPair} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-3 lg:gap-6">
                        <div className="text-sm uppercase text-white/75">
                          Utilization
                        </div>
                        <div className="inline-flex gap-2 font-mono lg:text-lg">
                          <LendingPairUtilization {...lendingPair} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-3 lg:gap-6">
                        <div className="text-sm uppercase text-white/75">
                          Max LTV
                        </div>
                        <div className="inline-flex gap-2 font-mono lg:text-lg">
                          <LendingPairMaxLTV {...lendingPair} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-3 lg:gap-6">
                        <div className="text-sm uppercase text-white/75">
                          APY
                        </div>
                        <div className="inline-flex gap-2 font-mono lg:text-lg">
                          <LendingPairAPY {...lendingPair} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-3 lg:gap-6">
                        <div className="text-sm uppercase text-white/75">
                          Exchange rate
                        </div>
                        <div className="inline-flex gap-2 font-mono lg:text-lg">
                          1 <LendingPairCollateral {...lendingPair} /> ={" "}
                          <CollateralExchangeRate {...lendingPair} />
                          <LendingPairAsset {...lendingPair} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="rounded-lg bg-pink-900/80 p-3 backdrop-blur-md">
                    <Tabs.Root defaultValue="deposit">
                      <Tabs.List className="-mx-3 -mt-3 divide-x divide-pink/30 border-b border-pink/30">
                        <Tabs.Trigger
                          value="deposit"
                          className="transition-color w-1/2 rounded-tl-lg pb-3.5 pt-5 text-xs font-semibold uppercase text-pink-100/50 duration-200 ease-linear ui-state-active:bg-pink/10 ui-state-active:text-orange-400"
                        >
                          Deposit
                        </Tabs.Trigger>
                        <Tabs.Trigger
                          value="withdraw"
                          className="transition-color w-1/2 rounded-tr-lg pb-3.5 pt-5 text-xs font-semibold uppercase text-pink-100/50 duration-200 ease-linear ui-state-active:bg-pink/10 ui-state-active:text-orange-400"
                        >
                          Withdraw
                        </Tabs.Trigger>
                      </Tabs.List>
                      <Tabs.Content value="deposit" className="pt-3">
                        <LendingPairDepositForm {...lendingPair} />
                      </Tabs.Content>
                      <Tabs.Content value="withdraw" className="pt-3">
                        <LendingPairRedeem {...lendingPair} />
                      </Tabs.Content>
                    </Tabs.Root>
                  </div>
                </div>
              </main>
            </>
          ) : (
            <LendingPairNotFound />
          )
        ) : null}
      </Layout>
    </DisabledPage>
  )
}

export default LendingPairDetail

const LendingPairNotFound: FC = () => {
  return (
    <>
      <Seo templateTitle="Pair not found | Lend" robots="nofollow,noindex" />

      <main>
        <div className="rounded-lg bg-pink-900/80 p-4 backdrop-blur-md lg:p-6">
          <header>
            <Link
              {...resolvedRoute("/app/lend")}
              className="flex items-center gap-2 text-sm font-medium uppercase text-pink-100"
            >
              <FiArrowLeft className="h-4 w-4" />
              Lend
            </Link>
            <h1 className="mt-3 font-display text-3xl lg:text-4xl">
              Lending pair not found
            </h1>

            <p className="mt-3 leading-relaxed text-white/75 lg:text-lg">
              This lending pair doesn't exist. Try returning to the{" "}
              <Link {...resolvedRoute("/app/lend")} className="underline">
                lending pairs list
              </Link>
              .
            </p>
          </header>
        </div>
      </main>
    </>
  )
}

const LendingPairSeo: FC<LendingPair> = ({ chainId, pairAddress }) => {
  const isClientReady = useClientReady()
  const share = useTokenOrNative({ address: pairAddress, chainId })
  return (
    <Seo
      templateTitle={
        isClientReady ? `${share.data?.name ?? "Loading..."} | Lend` : "Lend"
      }
      robots="nofollow,noindex"
    />
  )
}

const LendingPairHeading: FC<LendingPair> = ({ pairAddress, chainId }) => {
  const lendingPair = useLendingPair({ pairAddress, chainId })
  const share = useTokenOrNative({ address: pairAddress, chainId })
  return (
    <div className="flex items-center gap-3">
      <div className="flex">
        <AssetLogo
          chainId={chainId}
          className="relative z-10 flex h-8 w-8"
          tokenAddress={lendingPair.data?.assetContract}
        />
        <AssetLogo
          chainId={chainId}
          className="-ml-4 flex h-8 w-8"
          tokenAddress={lendingPair.data?.collateralContract}
        />
      </div>
      <Skeleton isLoading={share.isLoading} loadingText="Loading lending pair">
        {share.data?.name}
      </Skeleton>
    </div>
  )
}

const LendingPairAsset: FC<LendingPair> = ({ pairAddress, chainId }) => {
  const lendingPair = useLendingPair({ pairAddress, chainId })
  return (
    <AssetSymbol address={lendingPair.data?.assetContract} chainId={chainId} />
  )
}

const LendingPairCollateral: FC<LendingPair> = ({ pairAddress, chainId }) => {
  const lendingPair = useLendingPair({ pairAddress, chainId })
  return (
    <AssetSymbol
      address={lendingPair.data?.collateralContract}
      chainId={chainId}
    />
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
        abbreviate: true,
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
        abbreviate: true,
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
        abbreviate: true,
      })}
    </Skeleton>
  )
}

const UserAssetsLent: FC<LendingPair> = ({ pairAddress, chainId }) => {
  const { isConnected } = useAccount()
  const shareBalance = useTokenOrNativeBalance({
    address: pairAddress,
    chainId,
  })
  const lendingPair = useLendingPair({ pairAddress, chainId })
  const pairLeverParams = usePairLeverParams({ pairAddress, chainId })
  const asset = useTokenOrNative({
    address: lendingPair.data?.assetContract,
    chainId,
  })
  const assetsLent = useConvertToAssets({
    shares: shareBalance.data?.value,
    totalBorrowAmount: pairLeverParams.data.totalBorrowAmount,
    totalBorrowShares: pairLeverParams.data.totalBorrowShares,
    pairAddress,
  })

  return (
    <Skeleton isLoading={pairLeverParams.isLoading} loadingText="...">
      {isConnected
        ? formatCurrencyUnits({
            amountWei: assetsLent.data?.toString(),
            decimals: asset.data?.decimals,
            abbreviate: true,
          })
        : "—"}
    </Skeleton>
  )
}
