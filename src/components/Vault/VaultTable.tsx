import { FC } from "react"

import useCompounderPoolAddresses from "@/hooks/data/useCompounderPoolAddresses"
import { VaultProps } from "@/hooks/types"

import Spinner from "@/components/Spinner"
import VaultRow from "@/components/Vault/VaultRow"
import {
  VaultTableHeader,
  VaultTableRow,
} from "@/components/Vault/VaultTableNode"

const VaultTable: FC<Pick<VaultProps, "type">> = ({ type }) => {
  const { data: vaultAddresses, isLoading } = useCompounderPoolAddresses({
    type,
  })

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
      <div className="space-y-2" role="rowgroup">
        {isLoading ? (
          <VaultsLoading />
        ) : !vaultAddresses?.length ? (
          <NoVaultsFound />
        ) : (
          vaultAddresses?.map((address, i) => (
            <VaultRow key={`pool-${i}`} address={address} type={type} />
          ))
        )}
      </div>
    </div>
  )
}

export default VaultTable

const VaultsLoading: FC = () => {
  return (
    <VaultTableRow
      className="flex h-44 items-center rounded-t-none"
      aria-label="Loading vaults..."
    >
      <span className="col-span-full text-center" aria-hidden="true">
        <Spinner className="h-10 w-10" />
      </span>
    </VaultTableRow>
  )
}

const NoVaultsFound: FC = () => {
  return (
    <VaultTableRow className="flex h-44 items-center rounded-t-none">
      <h2 className="col-span-full text-center text-2xl">No vaults found...</h2>
    </VaultTableRow>
  )
}
