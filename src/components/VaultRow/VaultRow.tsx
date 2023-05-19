import * as Accordion from "@radix-ui/react-accordion"
import * as Tabs from "@radix-ui/react-tabs"
import { useRouter } from "next/router"
import { FC, MouseEventHandler } from "react"
import { Address } from "wagmi"

import clsxm from "@/lib/clsxm"
import { resolvedRoute } from "@/lib/helpers"
import { VaultProps } from "@/lib/types"
import { useVault } from "@/hooks"

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
import { VaultNameCell } from "@/components/VaultRow"
import {
  VaultApy,
  VaultEpoch,
  VaultTvl,
  VaultUserBalance,
  VaultUserEarnings,
} from "@/components/VaultRow/lib"
import { VaultManager } from "@/components/VaultRow/lib/VaultManager"

import { FortIconChevronDownCircle } from "@/icons"

export type VaultRowPropsWithProduct =
  | ({ productType: "compounder"; ybTokenAddress?: Address } & VaultProps)
  | ({ productType: "concentrator"; ybTokenAddress?: Address } & VaultProps)
  | ({ productType: "managedVaults"; ybTokenAddress?: Address } & VaultProps)

export type VaultTableRowProps = VaultRowPropsWithProduct & {
  activeVault?: string
  setActiveVault?: (activeVault: string | undefined) => void
  showEarningsColumn?: boolean
  setStrategyLink: ({
    pathname,
    category,
  }: {
    pathname: string
    category?: string | string[]
  }) => ReturnType<typeof resolvedRoute>
}

export const VaultRow: FC<VaultTableRowProps> = ({
  activeVault,
  setActiveVault,
  showEarningsColumn = false,
  setStrategyLink,
  ...props
}) => {
  const router = useRouter()
  const { pathname, query } = router
  const { isLoading } = useVault(props)

  const vaultAddress = props.vaultAddress

  const vaultStrategyLink = setStrategyLink({
    pathname,
    category: query.category,
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
        productType={props.productType}
      >
        {/* Row of vault info */}
        <TableCell
          className={clsxm(
            "relative grid grid-cols-[max-content,auto,max-content] items-center gap-x-3 max-lg:-mx-3 max-lg:border-b max-lg:border-b-pink/30 max-lg:px-3 max-lg:pb-3.5 lg:pointer-events-none",
            {
              "grid-cols-[auto,max-content]":
                props.productType === "managedVaults",
            }
          )}
        >
          <VaultNameCell {...props} />

          {/* Large: strategy button */}
          <ButtonLink
            {...vaultStrategyLink}
            scroll={false}
            className="focus-visible-outline-1 pointer-events-auto relative ring-orange-400 transition-transform duration-150 after:absolute after:inset-0 after:rounded after:opacity-0 after:shadow-button-glow after:transition-opacity after:duration-300 hover:-translate-y-0.5 hover:contrast-150 hover:after:opacity-100 focus:outline-none focus-visible:-translate-y-0.5 focus-visible:outline focus-visible:outline-orange focus-visible:contrast-150 focus-visible:after:opacity-100 active:translate-y-0 max-lg:hidden"
            size="base"
            variant="outline"
          >
            <GradientText>Strategy</GradientText>
          </ButtonLink>

          {/* Medium: strategy button */}
          <ButtonLink
            {...vaultStrategyLink}
            scroll={false}
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
        {props.productType === "compounder" && (
          <TableCell className="pointer-events-none text-center max-lg:hidden">
            <VaultUserEarnings {...props} />
          </TableCell>
        )}
        {props.productType === "managedVaults" && (
          <>
            <TableCell className="pointer-events-none text-center max-lg:hidden">
              <VaultEpoch />
            </TableCell>
            <TableCell className="pointer-events-none text-center max-lg:hidden">
              <VaultManager />
            </TableCell>
          </>
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
            {props.productType === "compounder" ? (
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
                {props.productType === "compounder" ? (
                  <CompounderVaultDepositForm {...props} />
                ) : (
                  <ConcentratorVaultDepositForm {...props} />
                )}
              </Tabs.Content>
              <Tabs.Content value="withdraw">
                {props.productType === "compounder" ? (
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
          <dl
            className={clsxm(
              "grid gap-x-3 text-center",
              { "grid-cols-4": props.productType === "compounder" },
              { "grid-cols-3": props.productType === "concentrator" },
              {
                "auto-cols-auto grid-flow-col":
                  props.productType === "managedVaults",
              }
            )}
          >
            <div className="grid grid-rows-2">
              <dt className="row-start-2 text-xs text-pink-100/60">APY</dt>
              <dd className="text-sm font-medium text-pink-100">
                <VaultApy {...props} />
              </dd>
            </div>
            <div className="grid grid-rows-2">
              <dt className="row-start-2 text-xs text-pink-100/60">TVL</dt>
              <dd className="text-sm font-medium text-pink-100">
                <VaultTvl {...props} />
              </dd>
            </div>
            <div className="grid grid-rows-2">
              <dt className="row-start-2 text-xs text-pink-100/60">Balance</dt>
              <dd className="text-sm font-medium text-pink-100">
                <VaultUserBalance {...props} />
              </dd>
            </div>
            {props.productType === "compounder" && (
              <div className="grid grid-rows-2">
                <dt className="row-start-2 text-xs text-pink-100/60">
                  Earnings
                </dt>
                <dd className="text-sm font-medium text-pink-100">
                  <VaultUserEarnings {...props} />
                </dd>
              </div>
            )}
            {props.productType === "managedVaults" && (
              <>
                <div className="grid grid-rows-2">
                  <dt className="row-start-2 text-xs text-pink-100/60">
                    Epoch
                  </dt>
                  <dd className="text-sm font-medium text-pink-100">
                    <VaultEpoch />
                  </dd>
                </div>
                <div className="grid grid-rows-2">
                  <dt className="row-start-2 text-xs text-pink-100/60">
                    Manager
                  </dt>
                  <dd className="text-sm font-medium text-pink-100">
                    <VaultManager />
                  </dd>
                </div>
              </>
            )}
          </dl>
        </TableCell>

        {/* Mobile: Action buttons */}
        <TableCell className="mb-0.5 pt-3.5 lg:hidden">
          <ButtonLink
            {...vaultStrategyLink}
            scroll={false}
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
