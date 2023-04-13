import * as Accordion from "@radix-ui/react-accordion"
import {
  Children,
  cloneElement,
  FC,
  isValidElement,
  PropsWithChildren,
  useState,
} from "react"

import { Table, TableBody, TableHeader, TableRow } from "@/components/Table"
import { TxSettingsPopover } from "@/components/TxSettingsPopover"
import { VaultTableRowProps } from "@/components/VaultRow/VaultRow"

type VaultTableProps = {
  label: string
  showEarningsColumn?: boolean
}

export const VaultTable: FC<PropsWithChildren<VaultTableProps>> = ({
  children,
  label,
  showEarningsColumn,
}) => {
  const [activeVault, setActiveVault] = useState<string | undefined>()

  return (
    <Table>
      <div className="relative z-[1] max-lg:hidden" role="rowgroup">
        <TableRow
          className="overflow-visible rounded-b-none border-b border-b-pink/30"
          showEarningsColumn={showEarningsColumn}
        >
          <TableHeader className="text-sm">{label}</TableHeader>
          <TableHeader className="text-center text-sm">APY</TableHeader>
          <TableHeader className="text-center text-sm">TVL</TableHeader>
          <TableHeader className="text-center text-sm">Balance</TableHeader>
          {showEarningsColumn && (
            <TableHeader className="text-center text-sm">Earnings</TableHeader>
          )}
          <TableHeader className="flex justify-end">
            <TxSettingsPopover />
          </TableHeader>
        </TableRow>
      </div>

      <Accordion.Root
        asChild
        value={activeVault}
        onValueChange={setActiveVault}
        type="single"
        collapsible
      >
        <TableBody>
          {Children.map(children, (c) => {
            if (isValidElement<VaultTableRowProps>(c)) {
              return cloneElement<VaultTableRowProps>(c, {
                activeVault,
                setActiveVault,
              })
            }
          })}
        </TableBody>
      </Accordion.Root>
    </Table>
  )
}
