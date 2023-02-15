import { FC } from "react"
import { Address } from "wagmi"

import { capitalizeFirstLetter } from "@/lib/helpers"
import { ConcentratorTargetAsset, FilterCategory, VaultType } from "@/lib/types"
import {
  useConcentratorVault,
  useConcentratorVaultAddresses,
} from "@/hooks/data/concentrators"
import useActiveChainId from "@/hooks/useActiveChainId"
import { useClientReady } from "@/hooks/util/useClientReady"

import { enabledNetworks } from "@/components/AppProviders"
import { TableEmpty, TableLoading } from "@/components/Table"
import VaultRow from "@/components/Vault/VaultRow"
import { VaultTable } from "@/components/Vault/VaultTable"

type ConcentratorVaultTableProps = {
  concentratorTargetAsset: ConcentratorTargetAsset
  filter: FilterCategory
  vaultType: VaultType
}

export const ConcentratorVaultTable: FC<ConcentratorVaultTableProps> = ({
  concentratorTargetAsset,
  filter,
  vaultType,
}) => {
  const clientReady = useClientReady()
  const concentratorVaultAddresses = useConcentratorVaultAddresses({
    concentratorTargetAsset,
    vaultType,
  })

  // TODO: should handle failure
  const showLoadingState =
    !clientReady ||
    concentratorVaultAddresses.isLoading ||
    !concentratorTargetAsset
  const label = capitalizeFirstLetter(filter)

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
      ) : !concentratorVaultAddresses.data?.length ? (
        <TableEmpty heading="Where Concentrators ser?">
          It seems we don't have {label} Concentrator Vaults for{" "}
          {capitalizeFirstLetter(vaultType)} (yet). Feel free to check out other
          Concentrator Vaults or try changing network. New Concentrators and
          strategies are added often, so check back later. Don't be a stranger.
        </TableEmpty>
      ) : (
        concentratorVaultAddresses.data?.map((vaultAssetAddress, i) => (
          <ConcentratorVaultRow
            key={`pool-${i}`}
            concentratorTargetAsset={concentratorTargetAsset}
            vaultAssetAddress={vaultAssetAddress}
            vaultType={vaultType}
          />
        ))
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
