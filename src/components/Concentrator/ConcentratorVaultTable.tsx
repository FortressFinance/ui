import { FC } from "react"
import { Address } from "wagmi"

import { FilterCategory } from "@/lib/types"
// import {
//   useConcentratorVault,
// } from "@/hooks"

// import { TableLoading } from "@/components/Table"
// import { VaultRow } from "@/components/VaultRow"

type ConcentratorVaultTableProps = {
  concentratorTargetAsset: Address
  filterCategory: FilterCategory
}

export const ConcentratorVaultTable: FC<ConcentratorVaultTableProps> = (/*{
  concentratorTargetAsset,
  filterCategory,
}*/) => {
  // const clientReady = useClientReady()
  // const concentratorTargetAssets = useConcentratorTargetAssets()
  // const concentratorsList = useListConcentrators({ concentratorTargetAssets })
  // const filteredConcentratorVaults = useFilteredConcentrators({
  //   concentratorsList,
  //   concentratorTargetAsset,
  //   filterCategory,
  // })

  // // TODO: should handle failure
  // const showLoadingState =
  //   !clientReady ||
  //   concentratorTargetAssets.isLoading ||
  //   concentratorsList.isLoading ||
  //   !concentratorTargetAsset
  // const label = capitalizeFirstLetter(filterCategory)

  // const chainId = useActiveChainId()
  // const availableChains = enabledNetworks.chains.filter((n) => n.id === chainId)
  // const supportedChain = availableChains?.[0]

  // return (
  //   <VaultTable label={`${label} Vaults`}>
  //     {showLoadingState ? (
  //       <TableLoading>Loading concentrators...</TableLoading>
  //     ) : !supportedChain ? (
  //       <TableEmpty heading="Unsupported network">
  //         Please switch to a supported network to view Concentrators.
  //       </TableEmpty>
  //     ) : !filteredConcentratorVaults?.length ? (
  //       <TableEmpty heading="Where Concentrator Vaults ser?">
  //         It seems we don't have{" "}
  //         <ConcentratorTargetAssetSymbol
  //           concentratorTargetAsset={concentratorTargetAsset}
  //         />{" "}
  //         Concentrator Vaults for {capitalizeFirstLetter(filterCategory)} (yet).
  //       </TableEmpty>
  //     ) : (
  //       filteredConcentratorVaults?.map(
  //         ({ concentratorTargetAsset, vaultAssetAddress, vaultType }, i) => (
  //           <ConcentratorVaultRow
  //             key={`pool-${i}`}
  //             concentratorTargetAsset={concentratorTargetAsset}
  //             vaultAssetAddress={vaultAssetAddress}
  //             vaultType={vaultType}
  //           />
  //         )
  //       )
  //     )}
  //   </VaultTable>
  // )
  return null
}

// type ConcentratorVaultRowProps = {
//   concentratorTargetAsset?: Address
//   vaultAssetAddress: Address
//   vaultType: VaultType
// }
