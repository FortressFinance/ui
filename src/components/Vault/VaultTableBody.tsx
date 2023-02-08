import { FC } from "react"

import { useVaultAddresses } from "@/hooks/data"
import { VaultProps } from "@/hooks/types"
import useActiveChainId from "@/hooks/useActiveChainId"

import { enabledNetworks } from "@/components/AppProviders"
import Spinner from "@/components/Spinner"
import { TableRow } from "@/components/Table/TableNode"
import VaultRow from "@/components/Vault/VaultRow"
import { capitalize } from "@/components/Vault/VaultTable"

const VaultTableBody: FC<Pick<VaultProps, "type">> = ({ type }) => {
  const { data: vaultAddresses, isLoading } = useVaultAddresses({
    type,
  })

  return (
    <div className="space-y-2" role="rowgroup">
      {isLoading ? (
        <VaultsLoading />
      ) : !vaultAddresses?.length ? (
        <NoVaultsFound type={type} />
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
    <TableRow
      className="flex h-44 items-center rounded-t-none"
      aria-label="Loading compounders..."
    >
      <span className="col-span-full text-center" aria-hidden="true">
        <Spinner className="h-10 w-10" />
      </span>
    </TableRow>
  )
}

const NoVaultsFound: FC<Pick<VaultProps, "type">> = ({ type }) => {
  const chainId = useActiveChainId()
  const availableChains = enabledNetworks.chains.filter((n) => n.id === chainId)
  const network = availableChains?.[0].name
  return (
    <TableRow className="flex h-44 items-center rounded-t-none">
      <div className="col-span-full">
        <h2 className="mb-3 text-center text-2xl font-semibold">
          Where Vaults ser?
        </h2>
        <p className="mx-auto max-w-3xl text-center text-sm">
          It seems we don't have {capitalize(type)} Vaults on {network} (yet).
          Feel free to check out other vaults on {network} or change network.
          New Vaults and strategies are added often, so check back later. Don't
          be a stranger.
        </p>
      </div>
    </TableRow>
  )
}
