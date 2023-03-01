import { FC } from "react"
import { Address } from "wagmi"

import { capitalizeFirstLetter } from "@/lib/helpers"
import { FilterCategory, VaultType } from "@/lib/types"
import {
  useConcentratorTargetAssets,
  useConcentratorVault,
  useListConcentrators,
} from "@/hooks/data/concentrators"
import useActiveChainId from "@/hooks/useActiveChainId"
import { useClientReady, useFilteredConcentrators } from "@/hooks/util"

import { enabledNetworks } from "@/components/AppProviders"
import { ConcentratorTargetAssetSymbol } from "@/components/Concentrator/ConcentratorTargetAsset"
import { TableEmpty, TableLoading } from "@/components/Table"
import VaultRow from "@/components/Vault/VaultRow"
import { VaultTable } from "@/components/Vault/VaultTable"

type ConcentratorVaultTableProps = {
  concentratorTargetAsset: Address
  filterCategory: FilterCategory
}

export const ConcentratorVaultTable: FC<ConcentratorVaultTableProps> = ({
  concentratorTargetAsset,
  filterCategory,
}) => {
  const clientReady = useClientReady()
  const concentratorTargetAssets = useConcentratorTargetAssets()
  const concentratorsList = useListConcentrators({ concentratorTargetAssets })
  const filteredConcentratorVaults = useFilteredConcentrators({
    concentratorsList,
    concentratorTargetAsset,
    filterCategory,
  })

  // TODO: should handle failure
  const showLoadingState =
    !clientReady ||
    concentratorTargetAssets.isLoading ||
    concentratorsList.isLoading ||
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
      ) : !filteredConcentratorVaults?.length ? (
        <TableEmpty heading="Where Concentrator Vaults ser?">
          It seems we don't have{" "}
          <ConcentratorTargetAssetSymbol
            concentratorTargetAsset={concentratorTargetAsset}
          />{" "}
          Concentrator Vaults for {capitalizeFirstLetter(filterCategory)} (yet).
        </TableEmpty>
      ) : (
        filteredConcentratorVaults?.map(
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
  concentratorTargetAsset?: Address
  vaultAssetAddress: Address
  vaultType: VaultType
}

const ConcentratorVaultRow: FC<ConcentratorVaultRowProps> = (props) => {
  const concentrator = useConcentratorVault(props)
  if (!concentrator.data)
    return <TableLoading>Loading concentrators...</TableLoading>
  return (
    <VaultRow
      asset={concentrator.data?.rewardTokenAddress}
      type={props.vaultType}
      vaultAddress={concentrator.data?.ybTokenAddress}
    />
  )
}
