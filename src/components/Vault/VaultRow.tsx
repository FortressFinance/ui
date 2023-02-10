import { Disclosure, Transition } from "@headlessui/react"
import { FC, Fragment, MouseEventHandler, useState } from "react"

import clsxm from "@/lib/clsxm"
import { VaultProps } from "@/lib/types"
import { useVaultTokens } from "@/hooks/data"
import {
  useIsCurveCompounder,
  useIsTokenCompounder,
} from "@/hooks/useVaultTypes"

import AssetLogo from "@/components/AssetLogo"
import { TableCell, TableRow } from "@/components/Table"
import {
  VaultApr,
  VaultDepositedLpTokens,
  VaultName,
  VaultTvl,
} from "@/components/Vault/VaultData"
import VaultDepositForm from "@/components/Vault/VaultDepositForm"
import VaultStrategyButton from "@/components/Vault/VaultStrategy"
import VaultWithdrawForm from "@/components/Vault/VaultWithdrawForm"

import ChevronDownCircle from "~/svg/icons/chevron-down-circle.svg"

const VaultRow: FC<VaultProps> = (props) => {
  const [isVaultOpen, setIsVaultOpen] = useState(false)

  const { isLoading } = useVaultTokens(props)

  const isCurve = useIsCurveCompounder(props.type)
  const isToken = useIsTokenCompounder(props.type)

  const toggleVaultOpen: MouseEventHandler<
    HTMLButtonElement | HTMLDivElement
  > = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsVaultOpen((v) => !v)
  }

  return (
    <>
      <Disclosure as={Fragment} key={props.asset}>
        <TableRow
          className="first:rounded-t-none lg:py-6"
          onClick={toggleVaultOpen}
          disabled={isLoading}
        >
          {/* Row of vault info */}
          <TableCell className="pointer-events-none sm:grid sm:grid-cols-[max-content,auto,max-content] sm:items-center sm:space-x-3">
            <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-white sm:flex">
              <AssetLogo
                className="h-6 w-6"
                name={isToken ? "token" : isCurve ? "curve" : "balancer"}
              />
            </div>
            <VaultName {...props} />
            <VaultStrategyButton {...props} />
          </TableCell>
          <TableCell className="pointer-events-none text-center">
            <VaultApr {...props} />
          </TableCell>
          <TableCell className="pointer-events-none text-center">
            <VaultTvl {...props} />
          </TableCell>
          <TableCell className="pointer-events-none text-center">
            <VaultDepositedLpTokens {...props} />
          </TableCell>

          {/* Action buttons */}
          <TableCell className="relative flex items-center">
            <button
              className="group absolute inset-0 flex items-center justify-end focus:outline-none"
              disabled={isLoading}
              onClick={toggleVaultOpen}
            >
              <div
                className={clsxm(
                  "group z-[1] block h-7 w-7 rounded-sm transition-transform duration-200 group-focus-visible:outline-double",
                  {
                    "cursor-wait": isLoading,
                    "-rotate-180": isVaultOpen,
                  }
                )}
              >
                <ChevronDownCircle
                  className="h-7 w-7"
                  aria-label="Open vault"
                />
              </div>
            </button>
          </TableCell>

          {/* Collapsible forms */}
          <Transition
            show={isVaultOpen}
            className="col-span-full overflow-hidden"
            enter="transition-all duration-200"
            enterFrom="transform opacity-0 max-h-0"
            enterTo="transform opacity-100 max-h-[1000px] md:max-h-80"
            leave="transition-all duration-200"
            leaveFrom="transform opacity-100 max-h-[1000px] md:max-h-80"
            leaveTo="transform opacity-0 max-h-0"
          >
            <Disclosure.Panel static>
              <div className="mt-6 grid gap-3 md:grid-cols-2 md:gap-4">
                <VaultDepositForm {...props} />
                <VaultWithdrawForm {...props} />
              </div>
            </Disclosure.Panel>
          </Transition>
        </TableRow>
      </Disclosure>
    </>
  )
}

export default VaultRow
