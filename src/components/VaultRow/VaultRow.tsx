import * as Accordion from "@radix-ui/react-accordion"
import * as Tabs from "@radix-ui/react-tabs"
import { useRouter } from "next/router"
import { FC, MouseEventHandler } from "react"

import clsxm from "@/lib/clsxm"
import { resolvedRoute } from "@/lib/helpers"
import { VaultProps } from "@/lib/types"
import { useVault } from "@/hooks"

import { AssetLogo } from "@/components/Asset"
import { ButtonLink } from "@/components/Button"
import {
  CompounderVaultDepositForm,
  CompounderVaultWithdrawForm,
} from "@/components/Compounder"
import {
  ConcentratorVaultDepositForm,
  ConcentratorVaultWithdrawForm,
} from "@/components/Concentrator"
import { TableCell, TableRow } from "@/components/Table"
import { GradientText } from "@/components/Typography"
import {
  VaultApy,
  VaultName,
  VaultTvl,
  VaultUserBalance,
  VaultUserEarnings,
} from "@/components/VaultRow/lib"

import { FortIconChevronDownCircle } from "@/icons"

export type VaultRowPropsWithProduct =
  | ({ productType: "compounder" } & VaultProps)
  | ({ productType: "concentrator" } & VaultProps)

export type VaultTableRowProps = VaultRowPropsWithProduct & {
  activeVault?: string
  setActiveVault?: (activeVault: string | undefined) => void
  showEarningsColumn?: boolean
}

export const VaultRow: FC<VaultTableRowProps> = ({
  activeVault,
  setActiveVault,
  showEarningsColumn = false,
  ...props
}) => {
  const isCompounderProduct = props.productType === "compounder"
  const router = useRouter()
  const { pathname, query } = router
  const { isLoading } = useVault(props)

  const vaultAddress = props.vaultAddress

  const vaultStrategyLink = resolvedRoute(pathname, {
    category: query.category,
    asset: props.asset,
    type: props.type,
    vaultAddress: props.vaultAddress,
  })

  const toggleVaultOpen: MouseEventHandler<
    HTMLButtonElement | HTMLDivElement
  > = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setActiveVault?.(
      activeVault === props.vaultAddress ? undefined : props.vaultAddress
    )
  }

  return (
    <Accordion.Item value={vaultAddress} asChild>
      <TableRow
        className="group lg:py-6 lg:first:rounded-t-none"
        onClick={toggleVaultOpen}
        disabled={isLoading}
        showEarningsColumn={showEarningsColumn}
      >
        {/* Row of vault info */}
        <TableCell className="relative grid grid-cols-[max-content,auto,max-content] items-center gap-x-3 max-lg:-mx-3 max-lg:border-b max-lg:border-b-pink/30 max-lg:px-3 max-lg:pb-3.5 lg:pointer-events-none">
          <AssetLogo className="flex h-12 w-12" tokenAddress={vaultAddress} />

          <span className="line-clamp-2 max-lg:mr-8">
            <VaultName {...props} />
          </span>

          {/* Large: strategy button */}
          <ButtonLink
            {...vaultStrategyLink}
            className="focus-visible-outline-1 pointer-events-auto relative ring-orange-400 transition-transform duration-150 after:absolute after:inset-0 after:rounded after:opacity-0 after:shadow-button-glow after:transition-opacity after:duration-300 hover:-translate-y-0.5 hover:contrast-150 hover:after:opacity-100 focus:outline-none focus-visible:-translate-y-0.5 focus-visible:outline focus-visible:outline-orange focus-visible:contrast-150 focus-visible:after:opacity-100 active:translate-y-0 max-lg:hidden"
            size="base"
            variant="outline"
          >
            <GradientText>Strategy</GradientText>
          </ButtonLink>

          {/* Medium: strategy button */}
          <ButtonLink
            {...vaultStrategyLink}
            className="focus-visible-outline-1 pointer-events-auto relative ring-orange-400 transition-transform duration-150 after:absolute after:inset-0 after:rounded after:opacity-0 after:shadow-button-glow after:transition-opacity after:duration-300 focus:outline-none focus-visible:-translate-y-0.5 focus-visible:outline focus-visible:outline-orange focus-visible:contrast-150 focus-visible:after:opacity-100 active:translate-y-0 max-lg:hidden lg:hidden lg:enabled:hover:-translate-y-0.5 lg:enabled:hover:contrast-150 lg:enabled:hover:after:opacity-100"
            size="small"
            variant="outline"
          >
            <GradientText>Strategy</GradientText>
          </ButtonLink>

          {/* Mobile: expand/collapse button */}
          <Accordion.Trigger asChild>
            <button
              className="group absolute inset-0 flex items-center justify-end focus:outline-none lg:hidden"
              disabled={isLoading}
            >
              <div
                className={clsxm(
                  "group mb-3 mr-5 block h-6 w-6 rounded-sm transition-transform duration-200 group-focus-visible:outline-double group-ui-state-open:-rotate-180",
                  { "cursor-wait": isLoading }
                )}
              >
                <FortIconChevronDownCircle
                  className="h-full w-full fill-white"
                  aria-label="Open vault"
                />
              </div>
            </button>
          </Accordion.Trigger>
        </TableCell>

        {/* Desktop: APY, TVL, Balance */}
        <TableCell className="pointer-events-none text-center max-lg:hidden">
          <VaultApy {...props} />
        </TableCell>
        <TableCell className="pointer-events-none text-center max-lg:hidden">
          <VaultTvl {...props} />
        </TableCell>
        <TableCell className="pointer-events-none text-center max-lg:hidden">
          <VaultUserBalance {...props} />
        </TableCell>
        {isCompounderProduct && (
          <TableCell className="pointer-events-none text-center max-lg:hidden">
            <VaultUserEarnings {...props} />
          </TableCell>
        )}

        {/* Desktop: Action buttons */}
        <TableCell className="relative flex items-center max-lg:hidden">
          <Accordion.Trigger asChild>
            <button
              className="group absolute inset-0 flex items-center justify-end focus:outline-none"
              disabled={isLoading}
              onClick={toggleVaultOpen}
            >
              <div
                className={clsxm(
                  "group z-[1] block h-5 w-5 rounded-sm transition-transform duration-200 group-focus-visible:outline-double group-ui-state-open:-rotate-180",
                  { "cursor-wait": isLoading }
                )}
              >
                <FortIconChevronDownCircle
                  className="h-5 w-5 fill-white"
                  aria-label="Open vault"
                />
              </div>
            </button>
          </Accordion.Trigger>
        </TableCell>

        <Accordion.Content className="col-span-full overflow-hidden ui-state-closed:animate-accordion-close ui-state-open:animate-accordion-open max-lg:-mx-3">
          {/* Desktop: forms */}
          <div className="mt-6 grid grid-cols-2 gap-4 max-lg:hidden">
            {isCompounderProduct ? (
              <>
                <CompounderVaultDepositForm {...props} />
                <CompounderVaultWithdrawForm {...props} />
              </>
            ) : (
              <>
                <ConcentratorVaultDepositForm {...props} />
                <ConcentratorVaultWithdrawForm {...props} />
              </>
            )}
          </div>

          {/* Mobile: forms */}
          <div className="border-b border-b-pink/30 lg:hidden">
            <Tabs.Root defaultValue="deposit">
              <Tabs.List className="divide-x divide-pink/30 border-b border-b-pink/30">
                <Tabs.Trigger
                  value="deposit"
                  className="transition-color w-1/2 py-3.5 text-xs font-semibold uppercase text-pink-100/50 duration-200 ease-linear ui-state-active:bg-pink/10 ui-state-active:text-orange-400"
                >
                  Deposit
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="withdraw"
                  className="transition-color w-1/2 py-3.5 text-xs font-semibold uppercase text-pink-100/50 duration-200 ease-linear ui-state-active:bg-pink/10 ui-state-active:text-orange-400"
                >
                  Withdraw
                </Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="deposit">
                {isCompounderProduct ? (
                  <CompounderVaultDepositForm {...props} />
                ) : (
                  <ConcentratorVaultDepositForm {...props} />
                )}
              </Tabs.Content>
              <Tabs.Content value="withdraw">
                {isCompounderProduct ? (
                  <CompounderVaultWithdrawForm {...props} />
                ) : (
                  <ConcentratorVaultWithdrawForm {...props} />
                )}
              </Tabs.Content>
            </Tabs.Root>
          </div>
        </Accordion.Content>

        {/* Mobile: APY, TVL, Balance */}
        <TableCell className="-mx-3 border-b border-b-pink/30 px-3 py-3 lg:hidden">
          <dl className="grid grid-cols-4 gap-x-3 text-center">
            <dt className="row-start-2 text-xs text-pink-100/60">APY</dt>
            <dd className="text-sm font-medium text-pink-100">
              <VaultApy {...props} />
            </dd>
            <dt className="row-start-2 text-xs text-pink-100/60">TVL</dt>
            <dd className="text-sm font-medium text-pink-100">
              <VaultTvl {...props} />
            </dd>
            <dt className="row-start-2 text-xs text-pink-100/60">Balance</dt>
            <dd className="text-sm font-medium text-pink-100">
              <VaultUserBalance {...props} />
            </dd>
            {isCompounderProduct && (
              <>
                <dt className="row-start-2 text-xs text-pink-100/60">
                  Earnings
                </dt>
                <dd className="text-sm font-medium text-pink-100">
                  <VaultUserEarnings {...props} />
                </dd>
              </>
            )}
          </dl>
        </TableCell>

        {/* Mobile: Action buttons */}
        <TableCell className="mb-0.5 pt-3.5 lg:hidden">
          <ButtonLink
            {...vaultStrategyLink}
            className="w-full text-center"
            variant="outline"
            size="small"
          >
            <GradientText>Strategy</GradientText>
          </ButtonLink>
        </TableCell>
      </TableRow>
    </Accordion.Item>
  )
}
