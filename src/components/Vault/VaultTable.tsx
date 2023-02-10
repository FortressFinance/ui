import { FC, PropsWithChildren } from "react"

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderRow,
} from "@/components/Table/Table"

type VaultTableProps = {
  label: string
}

export const VaultTable: FC<PropsWithChildren<VaultTableProps>> = ({
  label,
  children,
}) => {
  return (
    <Table>
      <TableHeaderRow>
        <TableHeader>{label}</TableHeader>
        <TableHeader className="text-center">APR</TableHeader>
        <TableHeader className="text-center">TVL</TableHeader>
        <TableHeader className="text-center">Deposit</TableHeader>
        <TableHeader>
          <span className="sr-only">Vault actions</span>
        </TableHeader>
      </TableHeaderRow>

      <TableBody>{children}</TableBody>
    </Table>
  )
}
