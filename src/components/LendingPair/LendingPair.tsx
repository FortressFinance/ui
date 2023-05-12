import Link from "next/link"
import { FC } from "react"

import { resolvedRoute } from "@/lib/helpers"
import { useLendingPair } from "@/hooks"

import { AssetBalance, AssetLogo } from "@/components/Asset"
import { ButtonLink } from "@/components/Button"
import { LendingPairAPY } from "@/components/LendingPair/LendingPairAPY"
import { LendingPairUtilization } from "@/components/LendingPair/LendingPairUtilization"
import { TableCell } from "@/components/Table"

import { LendingPair } from "@/constant"

export const LendingPairRow: FC<LendingPair> = (lendingPair) => {
  const lendingPairData = useLendingPair(lendingPair)

  return (
    <>
      <TableCell className="pointer-events-none grid grid-cols-[max-content,auto] items-center gap-x-3 max-lg:-mx-3 max-lg:border-b max-lg:border-b-pink/30 max-lg:px-3 max-lg:pb-3.5 lg:pointer-events-none">
        <div className="flex">
          <AssetLogo
            className="relative z-10 flex h-12 w-12 shadow shadow-black"
            tokenAddress={lendingPairData.data?.assetContract}
          />
          <AssetLogo
            className="-ml-6 flex h-12 w-12"
            tokenAddress={lendingPairData.data?.collateralContract}
          />
        </div>

        <h1>{lendingPair.name}</h1>
      </TableCell>

      {/* Desktop stats */}
      <TableCell className="pointer-events-none text-center max-lg:hidden">
        <LendingPairAPY apyType="lend" {...lendingPair} />
      </TableCell>
      <TableCell className="pointer-events-none text-center max-lg:hidden">
        <LendingPairUtilization {...lendingPair} />
      </TableCell>
      <TableCell className="pointer-events-none text-center max-lg:hidden">
        <AssetBalance
          address={lendingPair.pairAddress}
          chainId={lendingPair.chainId}
          abbreviate
        />
      </TableCell>

      {/* Mobile stats */}
      <TableCell className="-mx-3 border-b border-b-pink/30 px-3 py-3 lg:hidden">
        <dl className="grid grid-cols-3 gap-x-3 text-center">
          <dt className="row-start-2 text-xs text-pink-100/60">APY</dt>
          <dd className="text-sm font-medium text-pink-100">
            <LendingPairAPY apyType="lend" {...lendingPair} />
          </dd>
          <dt className="row-start-2 text-xs text-pink-100/60">Utilization</dt>
          <dd className="text-sm font-medium text-pink-100">
            <LendingPairUtilization {...lendingPair} />
          </dd>
          <dt className="row-start-2 text-xs text-pink-100/60">Shares</dt>
          <dd className="text-sm font-medium text-pink-100">
            <AssetBalance
              address={lendingPair.pairAddress}
              chainId={lendingPair.chainId}
              abbreviate
            />
          </dd>
        </dl>
      </TableCell>

      <TableCell>
        <ButtonLink
          {...resolvedRoute(`/app/lend/${lendingPair.pairAddress}`)}
          className="w-full text-center max-lg:mt-3"
          variant="outline"
        >
          View pair
        </ButtonLink>
      </TableCell>

      <Link
        {...resolvedRoute(`/app/lend/${lendingPair.pairAddress}`)}
        className="absolute inset-0 -z-[1] block max-lg:hidden"
      />
    </>
  )
}
