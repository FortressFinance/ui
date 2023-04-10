import clsx from "clsx"
import { FC, PropsWithChildren } from "react"

import { Table, TableBody, TableHeader, TableRow } from "@/components/Table"
import { TxSettingsPopover } from "@/components/TxSettingsPopover"

type VaultTableProps = {
  label: string
  showEarningsColumn: boolean
}

export const VaultTable: FC<PropsWithChildren<VaultTableProps>> = ({
  children,
  label,
  showEarningsColumn,
}) => {
  return (
    <Table>
      <div className="relative z-[1] max-lg:hidden" role="rowgroup">
        <TableRow
          className={clsx(
            "overflow-visible rounded-b-none border-b border-b-pink/30",
            showEarningsColumn ? "" : "lg:grid-cols-[4fr,1fr,1fr,1fr,3.5rem]"
          )}
        >
          <TableHeader className="text-sm">{label}</TableHeader>
          <TableHeader className="text-center text-sm">APY</TableHeader>
          <TableHeader className="text-center text-sm">TVL</TableHeader>
          <TableHeader className="text-center text-sm">Balance</TableHeader>
          {showEarningsColumn && (
            <TableHeader className="text-center text-sm">Earnings</TableHeader>
          )}
          <TableHeader>
            <TxSettingsPopover />
          </TableHeader>
        </TableRow>
      </div>

      <TableBody>{children}</TableBody>
    </Table>
  )
}
