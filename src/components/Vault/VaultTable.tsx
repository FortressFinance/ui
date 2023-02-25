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
      <div className="relative z-[1] max-md:hidden" role="rowgroup">
        <TableRow className="overflow-visible rounded-b-none border-b border-b-pink/30">
          <TableHeader>{label}</TableHeader>
          <TableHeader className="text-center">APY</TableHeader>
          <TableHeader className="text-center">TVL</TableHeader>
          <TableHeader className="text-center">Balance</TableHeader>
          <TableHeader>
            <TxSettingsPopover />
          </TableHeader>
        </TableRow>
      </div>

      <TableBody>{children}</TableBody>
    </Table>
  )
}
