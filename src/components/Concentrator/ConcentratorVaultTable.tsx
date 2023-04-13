import { FC } from "react"
import { Address } from "wagmi"

import { capitalizeFirstLetter } from "@/lib/helpers"
import { ConcentratorVaultProps, FilterCategory } from "@/lib/types"
import { enabledNetworks } from "@/lib/wagmi"
import {
  useActiveChainId,
  useClientReady,
  useConcentratorTargetAssets,
  useFilteredConcentrators,
  useListConcentrators,
} from "@/hooks"

import { ConcentratorTargetAssetSymbol } from "@/components/Concentrator/ConcentratorTargetAsset"
import { TableEmpty, TableLoading } from "@/components/Table"
import { VaultRow } from "@/components/VaultRow"
import { VaultTable } from "@/components/VaultRow/lib"

type ConcentratorVaultTableProps = {
  concentratorTargetAsset: Address
  filterCategory: FilterCategory
}

export const ConcentratorVaultTable: FC<ConcentratorVaultTableProps> = ({
  concentratorTargetAsset,
  filterCategory,
}) => {
  const clientReady = useClientReady()
  const {
    data: concentratorTargetAssets,
    isLoading: concentratorTargetAssetsIsLoading,
  } = useConcentratorTargetAssets()
  const concentratorsList = useListConcentrators({ concentratorTargetAssets })
  const filteredConcentratorVaults = useFilteredConcentrators({
    concentratorsList,
    concentratorTargetAsset,
    filterCategory,
  })

  // TODO: should handle failure
  const showLoadingState =
    !clientReady ||
    concentratorTargetAssetsIsLoading ||
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
              targetAsset={concentratorTargetAsset}
              primaryAsset={vaultAssetAddress}
              type={vaultType}
            />
          )
        )
      )}
    </VaultTable>
  )
}

const ConcentratorVaultRow: FC<ConcentratorVaultProps> = (props) => {
  return (
    <VaultRow
      {...props}
      primaryAsset={props.primaryAsset}
      type={props.type}
      targetAsset={props.targetAsset}
      productType="concentrator"
    />
  )
}
