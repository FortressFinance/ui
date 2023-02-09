import { Popover, Transition } from "@headlessui/react"
import dynamic from "next/dynamic"
import { FC, Fragment, useState } from "react"
import { usePopper } from "react-popper"

import clsxm from "@/lib/clsxm"
import { VaultProps } from "@/lib/types"

import { TableHeader, TableRow } from "@/components/Table/TableNode"
import TxSettingsForm from "@/components/TxSettingsForm"

import Cog from "~/svg/icons/cog.svg"

const VaultTableBody = dynamic(
  () => import("@/components/Vault/VaultTableBody"),
  { ssr: false }
)

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const VaultTable: FC<Pick<VaultProps, "type">> = ({ type }) => {
  const vaultTitle = `${capitalize(type)} Vaults`
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
      <div className="relative z-[1]" role="rowgroup">
        <TableRow className="overflow-visible rounded-b-none border-b-2 border-b-pink/30">
          <TableHeader>{vaultTitle}</TableHeader>
          <TableHeader className="text-center">APR</TableHeader>
          <TableHeader className="text-center">TVL</TableHeader>
          <TableHeader className="text-center">Deposit</TableHeader>
          <TableHeader>
            <Popover className="relative flex justify-end">
              {({ open }) => (
                <>
                  <Popover.Button as={Fragment}>
                    <button
                      ref={setTxSettingsCog}
                      className={clsxm(
                        "relative flex h-5 w-5 items-center justify-center transition-transform duration-200",
                        {
                          "-rotate-180": open,
                        }
                      )}
                    >
                      <Cog className="h-6 w-6" />
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
                      className="z-20 w-72 rounded-md bg-orange-400 p-4 shadow-lg border-black/60 border"
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
          </TableHeader>
        </TableRow>
      </div>

      {/* Table body */}
      <VaultTableBody type={type} />
    </div>
  )
}

export default VaultTable
