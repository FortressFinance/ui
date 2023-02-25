import { FC } from "react"

import { TableEmpty, TableHeader, TableRow } from "@/components/Table"

const HoldingsTable: FC = () => {
  return (
    <div className="" role="table">
      {/* Table headings */}
      <div className="max-md:hidden" role="rowgroup">
        <TableRow className="rounded-b-none border-b border-b-pink/30">
          <TableHeader>Holdings</TableHeader>
          <TableHeader className="text-center">APY</TableHeader>
          <TableHeader className="text-center">TVL</TableHeader>
          <TableHeader className="text-center">Balance</TableHeader>
          <TableHeader>
            <span className="sr-only">Vault actions</span>
          </TableHeader>
        </TableRow>
      </div>

      {/* Table body */}
      <TableEmpty heading="Well, this is awkward...">
        You don't appear to have any deposits in our Vaults. There's an easy way
        to change that.
      </TableEmpty>
    </div>
  )
}

export default HoldingsTable
