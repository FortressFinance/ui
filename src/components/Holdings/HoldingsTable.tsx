import { FC } from "react"

import { TableHeader, TableRow } from "@/components/Table"

const HoldingsTable: FC = () => {
  return (
    <div className="" role="table">
      {/* Table headings */}
      <div className="" role="rowgroup">
        <TableRow className="rounded-b-none border-b-2 border-b-pink/30">
          <TableHeader>Holdings</TableHeader>
          <TableHeader className="text-center">APY</TableHeader>
          <TableHeader className="text-center">TVL</TableHeader>
          <TableHeader className="text-center">Deposit</TableHeader>
          <TableHeader>
            <span className="sr-only">Vault actions</span>
          </TableHeader>
        </TableRow>
      </div>

      {/* Table body */}
      <TableRow className="flex h-44 items-center rounded-t-none">
        <div className="col-span-full">
          <h2 className="mb-3 text-center text-2xl font-semibold">
            Well this is awkward...
          </h2>
          <p className="mx-auto max-w-3xl text-center text-sm">
            You don't appear to have any deposits in our Vaults. There's an easy
            way to change that.
          </p>
        </div>
      </TableRow>
    </div>
  )
}

export default HoldingsTable
