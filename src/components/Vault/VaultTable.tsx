import { FC, PropsWithChildren, ReactNode } from "react"

import clsxm from "@/lib/clsxm"

import { Table, TableBody, TableHeader, TableRow } from "@/components/Table"
import { TxSettingsPopover } from "@/components/TxSettingsPopover"

type VaultTableProps = {
  label: string
  extendedColumns?: ReactNode
  extendedClassName?: string
}

export const VaultTable: FC<PropsWithChildren<VaultTableProps>> = ({
  children,
  label,
  extendedColumns,
  extendedClassName,
}) => {
  return (
    <Table>
      <div className="relative z-[1] max-md:hidden" role="rowgroup">
        <TableRow
          className={clsxm(
            "overflow-visible rounded-b-none border-b border-b-pink/30",
            extendedClassName
          )}
        >
          <TableHeader>{label}</TableHeader>
          <TableHeader className="text-center">APY</TableHeader>
          <TableHeader className="text-center">TVL</TableHeader>
          <TableHeader className="text-center">Balance</TableHeader>
          {extendedColumns}
          <TableHeader>
            <TxSettingsPopover />
          </TableHeader>
        </TableRow>
      </div>

      <TableBody>{children}</TableBody>
    </Table>
  )
}
