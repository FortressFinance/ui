import { Disclosure, Tab, Transition } from "@headlessui/react"
import { useRouter } from "next/router"
import { FC, Fragment, MouseEventHandler, useState } from "react"

import clsxm from "@/lib/clsxm"
import { VaultProps } from "@/lib/types"
import { useVault } from "@/hooks"

import { AssetLogo } from "@/components/Asset"
import { ButtonLink } from "@/components/Button"
import { CompounderVaultApy } from "@/components/Compounder/CompounderVaultApy"
import { TableCell, TableRow } from "@/components/Table"
import { GradientText } from "@/components/Typography"
import {
  VaultDepositForm,
  VaultName,
  VaultTvl,
  VaultUserBalance,
  VaultUserEarnings,
  VaultWithdrawForm,
} from "@/components/VaultRow/lib"

import { FortIconChevronDownCircle } from "@/icons"

export const VaultRow: FC<VaultProps> = (props) => {
  const [isVaultOpen, setIsVaultOpen] = useState(false)

  const router = useRouter()
  const { isLoading } = useVault(props)

  const vaultStrategyUrl = `${router.asPath}?asset=${props.asset}&type=${props.type}&vaultAddress=${props.vaultAddress}`

  const toggleVaultOpen: MouseEventHandler<
    HTMLButtonElement | HTMLDivElement
  > = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsVaultOpen((v) => !v)
  }

  return (
    <Disclosure as={Fragment} key={props.asset}>
      <TableRow
        className="lg:py-6 lg:first:rounded-t-none"
        onClick={toggleVaultOpen}
        disabled={isLoading}
      >
        {/* Row of vault info */}
        <TableCell className="relative grid grid-cols-[max-content,auto,max-content] items-center gap-x-3 max-lg:-mx-3 max-lg:border-b max-lg:border-b-pink/30 max-lg:px-3 max-lg:pb-3.5 lg:pointer-events-none">
          <AssetLogo
            className="flex h-12 w-12"
            tokenAddress={props.vaultAddress}
          />

          <span className="line-clamp-2 max-lg:mr-8">
            <VaultName {...props} />
          </span>

          {/* Large: strategy button */}
          <ButtonLink
            href={vaultStrategyUrl}
            className="focus-visible-outline-1 pointer-events-auto relative ring-orange-400 transition-transform duration-150 after:absolute after:inset-0 after:rounded after:opacity-0 after:shadow-button-glow after:transition-opacity after:duration-300 hover:-translate-y-0.5 hover:contrast-150 hover:after:opacity-100 focus:outline-none focus-visible:-translate-y-0.5 focus-visible:outline focus-visible:outline-orange focus-visible:contrast-150 focus-visible:after:opacity-100 active:translate-y-0 max-lg:hidden"
            size="base"
            variant="outline"
          >
            <GradientText>Strategy</GradientText>
          </ButtonLink>

          {/* Medium: strategy button */}
          <ButtonLink
            href={vaultStrategyUrl}
            className="focus-visible-outline-1 pointer-events-auto relative ring-orange-400 transition-transform duration-150 after:absolute after:inset-0 after:rounded after:opacity-0 after:shadow-button-glow after:transition-opacity after:duration-300 focus:outline-none focus-visible:-translate-y-0.5 focus-visible:outline focus-visible:outline-orange focus-visible:contrast-150 focus-visible:after:opacity-100 active:translate-y-0 max-lg:hidden lg:hidden lg:enabled:hover:-translate-y-0.5 lg:enabled:hover:contrast-150 lg:enabled:hover:after:opacity-100"
            size="small"
            variant="outline"
          >
            <GradientText>Strategy</GradientText>
          </ButtonLink>

          {/* Mobile: expand/collapse button */}
          <button
            className="group absolute inset-0 flex items-center justify-end focus:outline-none lg:hidden"
            disabled={isLoading}
            onClick={toggleVaultOpen}
          >
            <div
              className={clsxm(
                "group mb-3 mr-5 block h-6 w-6 rounded-sm transition-transform duration-200 group-focus-visible:outline-double",
                {
                  "cursor-wait": isLoading,
                  "-rotate-180": isVaultOpen,
                }
              )}
            >
              <FortIconChevronDownCircle
                className="h-full w-full fill-white"
                aria-label="Open vault"
              />
            </div>
          </button>
        </TableCell>

        {/* Desktop: APY, TVL, Balance */}
        <TableCell className="pointer-events-none text-center max-lg:hidden">
          <CompounderVaultApy {...props} />
        </TableCell>
        <TableCell className="pointer-events-none text-center max-lg:hidden">
          <VaultTvl {...props} />
        </TableCell>
        <TableCell className="pointer-events-none text-center max-lg:hidden">
          <VaultUserBalance {...props} />
        </TableCell>
        <TableCell className="pointer-events-none text-center max-lg:hidden">
          <VaultUserEarnings {...props} />
        </TableCell>

        {/* Desktop: Action buttons */}
        <TableCell className="relative flex items-center max-lg:hidden">
          <button
            className="group absolute inset-0 flex items-center justify-end focus:outline-none"
            disabled={isLoading}
            onClick={toggleVaultOpen}
          >
            <div
              className={clsxm(
                "group z-[1] block h-5 w-5 rounded-sm transition-transform duration-200 group-focus-visible:outline-double",
                {
                  "cursor-wait": isLoading,
                  "-rotate-180": isVaultOpen,
                }
              )}
            >
              <FortIconChevronDownCircle
                className="h-5 w-5 fill-white"
                aria-label="Open vault"
              />
            </div>
          </button>
        </TableCell>

        {/* Forms */}
        <Transition
          show={isVaultOpen}
          className="col-span-full overflow-hidden max-lg:-mx-3"
          enter="transition-all duration-200"
          enterFrom="transform opacity-0 max-h-0"
          enterTo="transform opacity-100 max-h-80"
          leave="transition-all duration-200"
          leaveFrom="transform opacity-100 max-h-80"
          leaveTo="transform opacity-0 max-h-0"
        >
          <Disclosure.Panel static>
            {/* Desktop: forms */}
            <div className="mt-6 grid grid-cols-2 gap-4 max-lg:hidden">
              <VaultDepositForm {...props} />
              <VaultWithdrawForm {...props} />
            </div>

            {/* Mobile: forms */}
            <div className="border-b border-b-pink/30 lg:hidden">
              <Tab.Group>
                <Tab.List
                  as="div"
                  className="divide-x divide-pink/30 border-b border-b-pink/30"
                >
                  <Tab as={Fragment}>
                    {({ selected }) => (
                      <button
                        className={clsxm(
                          "transition-color w-1/2 py-3.5 text-xs font-semibold uppercase text-pink-100/50 duration-200 ease-linear",
                          { "bg-pink/10 text-orange-400": selected }
                        )}
                      >
                        Deposit
                      </button>
                    )}
                  </Tab>
                  <Tab as={Fragment}>
                    {({ selected }) => (
                      <button
                        className={clsxm(
                          "transition-color w-1/2 py-3.5 text-xs font-semibold uppercase text-pink-100/50 duration-200 ease-linear",
                          { "bg-pink/10 text-orange-400": selected }
                        )}
                      >
                        Withdraw
                      </button>
                    )}
                  </Tab>
                </Tab.List>

                <Tab.Panels>
                  <Tab.Panel>
                    <VaultDepositForm {...props} />
                  </Tab.Panel>
                  <Tab.Panel>
                    <VaultWithdrawForm {...props} />
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </div>
          </Disclosure.Panel>
        </Transition>

        {/* Mobile: APY, TVL, Balance */}
        <TableCell className="-mx-3 border-b border-b-pink/30 px-3 py-3 lg:hidden">
          <dl className="grid grid-cols-4 gap-x-3 text-center">
            <dt className="row-start-2 text-xs text-pink-100/60">APY</dt>
            <dd className="text-sm font-medium text-pink-100">
              <CompounderVaultApy {...props} />
            </dd>
            <dt className="row-start-2 text-xs text-pink-100/60">TVL</dt>
            <dd className="text-sm font-medium text-pink-100">
              <VaultTvl {...props} />
            </dd>
            <dt className="row-start-2 text-xs text-pink-100/60">Balance</dt>
            <dd className="text-sm font-medium text-pink-100">
              <VaultUserBalance {...props} />
            </dd>
            <dt className="row-start-2 text-xs text-pink-100/60">Earnings</dt>
            <dd className="text-sm font-medium text-pink-100">
              <VaultUserEarnings {...props} />
            </dd>
          </dl>
        </TableCell>

        {/* Mobile: Action buttons */}
        <TableCell className="mb-0.5 pt-3.5 lg:hidden">
          <ButtonLink
            href={vaultStrategyUrl}
            className="w-full text-center"
            variant="outline"
            size="small"
          >
            <GradientText>Strategy</GradientText>
          </ButtonLink>
        </TableCell>
      </TableRow>
    </Disclosure>
  )
}
