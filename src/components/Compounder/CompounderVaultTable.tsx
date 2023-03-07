import { FC } from "react"
import { Address } from "wagmi"

import { capitalizeFirstLetter } from "@/lib/helpers"
import { FilterCategory, VaultType } from "@/lib/types"
import {
  useCompounderVault,
  useListCompounders,
} from "@/hooks/data/compounders"
import useActiveChainId from "@/hooks/useActiveChainId"
import { useClientReady, useFilteredCompounders } from "@/hooks/util"

import { enabledNetworks } from "@/components/AppProviders"
import { TableEmpty, TableLoading } from "@/components/Table"
import VaultRow from "@/components/Vault/VaultRow"
import { VaultTable } from "@/components/Vault/VaultTable"

type CompounderVaultTableProps = {
  filterCategory?: FilterCategory
  vaultType?: VaultType
}

export const CompounderVaultTable: FC<CompounderVaultTableProps> = ({
  filterCategory,
  vaultType,
}) => {
  // handle hydration mismatch
  const clientReady = useClientReady()
  const chainId = useActiveChainId()
  const availableChains = enabledNetworks.chains.filter((n) => n.id === chainId)
  const supportedChain = availableChains?.[0]
  const network = supportedChain?.name

  const compoundersList = useListCompounders()
  const filteredCompounders = useFilteredCompounders({
    compoundersList,
    filterCategory,
    vaultType,
  })

  const displayName = capitalizeFirstLetter(filterCategory ?? vaultType ?? "")
  const showLoadingState = compoundersList.isLoading || !clientReady

  return (
    <VaultTable label={`${displayName} Compounders`}>
      {showLoadingState ? (
        <TableLoading>Loading compounders...</TableLoading>
      ) : !supportedChain ? (
        <TableEmpty heading="Unsupported network">
          Please switch to a supported network to view Compounders.
        </TableEmpty>
      ) : !filteredCompounders?.length ? (
        <TableEmpty heading="Where Compounders ser?">
          It seems we don't have {displayName} Compounders on {network} (yet).
          Feel free to check out other compounders on {network} or change
          network. New Compounders and strategies are added often, so check back
          later. Don't be a stranger.
        </TableEmpty>
      ) : (
        filteredCompounders?.map(({ vaultAssetAddress, vaultType }, i) => (
          <CompounderVaultRow
            key={`pool-${i}`}
            vaultAssetAddress={vaultAssetAddress}
            vaultType={vaultType}
          />
        ))
      )}
    </VaultTable>
  )
}

type CompounderVaultRowProps = {
  vaultAssetAddress: Address
  vaultType: VaultType
}

const CompounderVaultRow: FC<CompounderVaultRowProps> = (props) => {
  const vaultAddress = useCompounderVault(props)
  return (
    <VaultRow
      {...props}
      asset={props.vaultAssetAddress}
      type={props.vaultType}
      vaultAddress={vaultAddress.data?.ybTokenAddress}
    />
  )
}
