import dynamic from "next/dynamic"
import { FC, useState } from "react"
import { usePopper } from "react-popper"

import { VaultProps } from "@/lib/types"

import { TableHeader, TableRow } from "@/components/Table/TableNode"

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
      <div className="" role="rowgroup">
        <TableRow className="rounded-b-none border-b-2 border-b-pink/30">
          <TableHeader>{vaultTitle}</TableHeader>
          <TableHeader className="text-center">APR</TableHeader>
          <TableHeader className="text-center">TVL</TableHeader>
          <TableHeader className="text-center">Deposit</TableHeader>
          <TableHeader>
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
