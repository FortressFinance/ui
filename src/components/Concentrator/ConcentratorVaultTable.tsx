import { FC } from "react"
import { Address } from "wagmi"

import { capitalizeFirstLetter } from "@/lib/helpers"
import { ConcentratorTargetAsset, FilterCategory, VaultType } from "@/lib/types"
import {
  useConcentratorVault,
  useFilteredConcentratorVaults,
} from "@/hooks/data/concentrators"
import useActiveChainId from "@/hooks/useActiveChainId"
import { useClientReady } from "@/hooks/util/useClientReady"

import { enabledNetworks } from "@/components/AppProviders"
import { TableEmpty, TableLoading } from "@/components/Table"
import VaultRow from "@/components/Vault/VaultRow"
import { VaultTable } from "@/components/Vault/VaultTable"

type ConcentratorVaultTableProps = {
  concentratorTargetAsset: ConcentratorTargetAsset
  filterCategory: FilterCategory
}

export const ConcentratorVaultTable: FC<ConcentratorVaultTableProps> = ({
  concentratorTargetAsset,
  filterCategory,
}) => {
  const clientReady = useClientReady()
  const filteredConcentratorVaults = useFilteredConcentratorVaults({
    concentratorTargetAsset,
    filterCategory,
  })

  // TODO: should handle failure
  const showLoadingState =
    !clientReady ||
    filteredConcentratorVaults.isLoading ||
    !concentratorTargetAsset
  const label = capitalizeFirstLetter(filterCategory)

  const chainId = useActiveChainId()
  const availableChains = enabledNetworks.chains.filter((n) => n.id === chainId)
  const supportedChain = availableChains?.[0]

  return (
    <VaultTable label={`${label} Vaults`}>
      {showLoadingState ? (
        <TableLoading>Loading concentrators...</TableLoading>
      ) : !supportedChain ? (
        <TableEmpty heading="Unsupported network">
          Please switch to a supported network to view Concentrators.
        </TableEmpty>
      ) : !filteredConcentratorVaults.data?.length ? (
        <TableEmpty heading="Where Concentrators ser?">
          It seems we don't have {concentratorTargetAsset} Concentrator Vaults
          for {capitalizeFirstLetter(filterCategory)} (yet).
        </TableEmpty>
      ) : (
        filteredConcentratorVaults.data?.map(
          ({ concentratorTargetAsset, vaultAssetAddress, vaultType }, i) => (
            <ConcentratorVaultRow
              key={`pool-${i}`}
              concentratorTargetAsset={concentratorTargetAsset}
              vaultAssetAddress={vaultAssetAddress}
              vaultType={vaultType}
            />
          )
        )
      )}
    </VaultTable>
  )
}

type ConcentratorVaultRowProps = {
  concentratorTargetAsset: ConcentratorTargetAsset
  vaultAssetAddress: Address
  vaultType: VaultType
}

const ConcentratorVaultRow: FC<ConcentratorVaultRowProps> = (props) => {
  const { data: vaultProps } = useConcentratorVault(props)
  return <VaultRow {...vaultProps} />
}
