import { FC } from "react"

import { useVaultAddresses } from "@/hooks/data"
import { VaultProps } from "@/hooks/types"

import Spinner from "@/components/Spinner"
import VaultRow from "@/components/Vault/VaultRow"
import { VaultTableRow } from "@/components/Vault/VaultTableNode"

const VaultTableBody: FC<Pick<VaultProps, "type">> = ({ type }) => {
  const { data: vaultAddresses, isLoading } = useVaultAddresses({
    type,
  })

  return (
    <div className="space-y-2" role="rowgroup">
      {isLoading ? (
        <VaultsLoading />
      ) : !vaultAddresses?.length ? (
        <NoVaultsFound />
      ) : (
        vaultAddresses?.map((address, i) => (
          <VaultRow key={`pool-${i}`} asset={address} type={type} />
        ))
      )}
    </div>
  )
}

export default VaultTableBody

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
