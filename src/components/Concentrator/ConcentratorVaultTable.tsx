import { FC } from "react"
import { Address } from "wagmi"

import { capitalizeFirstLetter } from "@/lib/helpers"
import { FilterCategory } from "@/lib/types"
import { enabledNetworks } from "@/lib/wagmi"
import {
  useActiveChainId,
  useClientReady,
  useConcentratorTargetAssets,
  useFilteredConcentrators,
  useListConcentrators,
} from "@/hooks"

import { AssetSymbol } from "@/components/Asset"
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
    <VaultTable label={`${label} Vaults`} productType="concentrator" useAPR>
      {showLoadingState ? (
        <TableLoading>Loading concentrators...</TableLoading>
      ) : !supportedChain ? (
        <TableEmpty heading="Unsupported network">
          Please switch to a supported network to view Concentrators.
        </TableEmpty>
      ) : !filteredConcentratorVaults?.length ? (
        <TableEmpty heading="Where Concentrator Vaults ser?">
          It seems we don't have{" "}
          <AssetSymbol address={concentratorTargetAsset} /> Concentrator Vaults
          for {capitalizeFirstLetter(filterCategory)} (yet).
        </TableEmpty>
      ) : (
        filteredConcentratorVaults?.map(
          (
            {
              concentratorTargetAsset,
              vaultAssetAddress: primaryAsset,
              vaultType,
            },
            i
          ) => (
            <VaultRow
              key={`concentrator-${i}`}
              asset={concentratorTargetAsset}
              type={vaultType}
              vaultAddress={primaryAsset}
              productType="concentrator"
            />
          )
        )
      )}
    </VaultTable>
  )
}
