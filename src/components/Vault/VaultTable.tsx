import { Popover, Transition } from "@headlessui/react"
import dynamic from "next/dynamic"
import { FC, Fragment, useState } from "react"
import { usePopper } from "react-popper"

import clsxm from "@/lib/clsxm"
import { VaultProps } from "@/hooks/types"

import TxSettingsForm from "@/components/TxSettingsForm"
import {
  VaultTableHeader,
  VaultTableRow,
} from "@/components/Vault/VaultTableNode"

import Cog from "~/svg/icons/cog.svg"

const VaultTableBody = dynamic(
  () => import("@/components/Vault/VaultTableBody"),
  { ssr: false }
)

const VaultTable: FC<Pick<VaultProps, "type">> = ({ type }) => {
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

  return (
    <div className="" role="table">
      {/* Table headings */}
      <div className="" role="rowgroup">
        <VaultTableRow className="rounded-b-none border-b-2 border-b-pink/30">
          <VaultTableHeader>Vaults</VaultTableHeader>
          <VaultTableHeader className="text-center">APR</VaultTableHeader>
          <VaultTableHeader className="text-center">TVL</VaultTableHeader>
          <VaultTableHeader className="text-center">Deposit</VaultTableHeader>
          <VaultTableHeader>
            <Popover className="relative z-[99] flex justify-end">
              {({ open }) => (
                <>
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
                      <Cog className="h-5 w-5" />
                    </button>
                  </Popover.Button>

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
            <span className="sr-only">Vault actions</span>
          </VaultTableHeader>
        </VaultTableRow>
      </div>

      {/* Table body */}
      <VaultTableBody type={type} />
    </div>
  )
}

export default VaultTable
