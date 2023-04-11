import { FC, PropsWithChildren } from "react"

import { Table, TableBody, TableHeader, TableRow } from "@/components/Table"
import { TxSettingsPopover } from "@/components/TxSettingsPopover"

type VaultTableProps = {
  label: string
}

export const VaultTable: FC<PropsWithChildren<VaultTableProps>> = ({
  children,
  label,
}) => {
  return (
    <Table>
      <div className="relative z-[1] max-lg:hidden" role="rowgroup">
        <TableRow className="overflow-visible rounded-b-none border-b border-b-pink/30">
          <TableHeader className="text-sm">{label}</TableHeader>
          <TableHeader className="text-center text-sm">APY</TableHeader>
          <TableHeader className="text-center text-sm">TVL</TableHeader>
          <TableHeader className="text-center text-sm">Balance</TableHeader>
          <TableHeader className="text-center text-sm">Earnings</TableHeader>
          <TableHeader className="flex justify-end">
            <TxSettingsPopover />
          </TableHeader>
        </TableRow>
      </div>

      <TableBody>{children}</TableBody>
    </Table>
  )
}
