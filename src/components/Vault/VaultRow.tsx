import { Disclosure, Popover, Transition } from "@headlessui/react"
import { FC, Fragment, MouseEventHandler, useState } from "react"
import { usePopper } from "react-popper"

import clsxm from "@/lib/clsxm"
import { useVaultTokens } from "@/hooks/data"
import { VaultProps } from "@/hooks/types"
import useIsCurve from "@/hooks/useIsCurve"

import AssetLogo from "@/components/AssetLogo"
import TxSettingsForm from "@/components/TxSettingsForm"
import {
  VaultApr,
  VaultDepositedLpTokens,
  VaultName,
  VaultTvl,
} from "@/components/Vault/VaultData"
import VaultDepositForm from "@/components/Vault/VaultDepositForm"
import VaultStrategyButton from "@/components/Vault/VaultStrategy"
import {
  VaultTableCell,
  VaultTableRow,
} from "@/components/Vault/VaultTableNode"
import VaultWithdrawForm from "@/components/Vault/VaultWithdrawForm"

import ChevronDownCircle from "~/svg/icons/chevron-down-circle.svg"
import Cog from "~/svg/icons/cog.svg"

const VaultRow: FC<VaultProps> = (props) => {
  const [isVaultOpen, setIsVaultOpen] = useState(false)
  const [txSettingsCog, setTxSettingsCog] = useState<HTMLButtonElement | null>(
    null
  )
  const [txSettingsPopover, setTxSettingsPopover] =
    useState<HTMLDivElement | null>(null)
  const { styles, attributes } = usePopper(txSettingsCog, txSettingsPopover, {
    placement: "bottom-end",
    modifiers: [
      { name: "preventOverflow", options: { padding: 8 } },
      { name: "offset", options: { offset: [24, 4] } },
    ],
  })

  const { isLoading } = useVaultTokens(props)

  const isCurve = useIsCurve(props.type)

  const toggleVaultOpen: MouseEventHandler<
    HTMLButtonElement | HTMLDivElement
  > = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsVaultOpen((v) => !v)
  }

  return (
    <>
      <Disclosure as={Fragment}>
        <VaultTableRow
          className="first:rounded-t-none lg:py-6"
          onClick={toggleVaultOpen}
          disabled={isLoading}
        >
          {/* Row of vault info */}
          <VaultTableCell className="pointer-events-none sm:grid sm:grid-cols-[max-content,auto,max-content] sm:items-center sm:space-x-3">
            <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-white sm:flex">
              <AssetLogo
                className="h-6 w-6"
                name={
                  isCurve === undefined
                    ? "token"
                    : isCurve
                      ? "curve"
                      : "balancer"
                }
              />
            </div>
            <VaultName {...props} />
            <VaultStrategyButton {...props} />
          </VaultTableCell>
          <VaultTableCell className="pointer-events-none text-center">
            <VaultApr {...props} />
          </VaultTableCell>
          <VaultTableCell className="pointer-events-none text-center">
            <VaultTvl {...props} />
          </VaultTableCell>
          <VaultTableCell className="pointer-events-none text-center">
            <VaultDepositedLpTokens {...props} />
          </VaultTableCell>

          {/* Action buttons */}
          <VaultTableCell className="relative flex items-center">
            <Popover className="relative z-[1] flex justify-start">
              {({ open }) => (
                <>
                  <Transition
                    show={isVaultOpen}
                    enter="transition-all duration-200"
                    enterFrom="opacity-0 translate-x-4"
                    enterTo="opacity-100 translate-x-0"
                    leave="transition-all duration-200"
                    leaveFrom="opacity-100 translate-x-0"
                    leaveTo="opacity-0 translate-x-4"
                  >
                    <Popover.Button as={Fragment}>
                      <button
                        ref={setTxSettingsCog}
                        className={clsxm(
                          "relative z-[1] flex h-7 w-7 items-center justify-center transition-transform duration-200",
                          {
                            "-rotate-180": open,
                          }
                        )}
                      >
                        <Cog className="h-6 w-6" />
                      </button>
                    </Popover.Button>
                  </Transition>

                  <Transition
                    show={open}
                    enter="transition-all duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-all duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Popover.Panel
                      as="div"
                      ref={setTxSettingsPopover}
                      className="z-20 w-72 rounded-md bg-orange-400 p-4 shadow-lg"
                      style={styles.popper}
                      {...attributes.popper}
                      static
                    >
                      <TxSettingsForm />
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>

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
          </VaultTableCell>

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
        </VaultTableRow>
      </Disclosure>
    </>
  )
}

export default VaultRow
