import { FC } from "react"

import { TableHeader, TableRow } from "@/components/Table/TableNode"

const HoldingsTable: FC = () => {
  return (
    <div className="" role="table">
      {/* Table headings */}
      <div className="" role="rowgroup">
        <TableRow className="rounded-b-none border-b-2 border-b-pink/30">
          <TableHeader>Holdings</TableHeader>
          <TableHeader className="text-center">APR</TableHeader>
          <TableHeader className="text-center">TVL</TableHeader>
          <TableHeader className="text-center">Deposit</TableHeader>
          <TableHeader>
            <span className="sr-only">Vault actions</span>
          </TableHeader>
        </TableRow>
      </div>

      {/* Table body */}
      <TableRow className="flex h-44 items-center rounded-t-none">
        <div className="grid grid-rows-[2fr,1fr] col-span-full">
          <h2 className="text-center font-semibold text-2xl">Well this is awkward...</h2>
          <p className="text-center text-sm">You don't appear to have any deposits in our Vaults. There's an easy way to change that</p>
        </div>
      </TableRow>
    </div>
  )
}

export default HoldingsTable