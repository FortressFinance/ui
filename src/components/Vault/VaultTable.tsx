import dynamic from "next/dynamic"
import { FC } from "react"

import { VaultProps } from "@/hooks/types"

import {
  VaultTableHeader,
  VaultTableRow,
} from "@/components/Vault/VaultTableNode"

const VaultTableBody = dynamic(
  () => import("@/components/Vault/VaultTableBody"),
  { ssr: false }
)

const VaultTable: FC<Pick<VaultProps, "type">> = ({ type }) => {
  return (
    <div className="" role="table">
      {/* Table headings */}
      <div className="" role="rowgroup">
        <VaultTableRow className="rounded-b-none border-b-2 border-b-pink/30">
          <VaultTableHeader>Vaults</VaultTableHeader>
          <VaultTableHeader className="text-center">APR</VaultTableHeader>
          <VaultTableHeader className="text-center">TVL</VaultTableHeader>
          <VaultTableHeader className="text-center">Deposit</VaultTableHeader>
          <VaultTableHeader>
            <span className="sr-only">Vault actions</span>
          </VaultTableHeader>
        </VaultTableRow>
      </div>

      {/* Table body */}
      <VaultTableBody type={type} />
    </div>
  )
}

export default VaultTable
