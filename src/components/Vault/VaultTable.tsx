import dynamic from "next/dynamic"
import { FC } from "react"

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
