import { FC } from "react"
import { useAccount } from "wagmi"

import { enabledNetworks } from "@/lib/wagmi"
import {
  useActiveChainId,
  useClientReady,
  useConcentratorTargetAssets,
  useHoldingsVaults,
  useListConcentrators,
} from "@/hooks"

import { TableDisconnected, TableEmpty, TableLoading } from "@/components/Table"
import { VaultRow } from "@/components/VaultRow"
import { VaultTable } from "@/components/VaultRow/lib"

const ConcentratorHoldingsTable: FC = () => {
  const ready = useClientReady()
  const { isConnected } = useAccount()
  const chainId = useActiveChainId()
  const availableChains = enabledNetworks.chains.filter((n) => n.id === chainId)
  const supportedChain = availableChains?.[0]

  const {
    data: concentratorTargetAssets,
    isLoading: concentratorTargetAssetsIsLoading,
  } = useConcentratorTargetAssets()
  const { data: concentratorsList, isLoading: concentratorsListIsLoading } =
    useListConcentrators({ concentratorTargetAssets })
  const { data: holdingsVaults, isLoading: isLoadingHoldingsVault } =
    useHoldingsVaults()

  const showLoadingState =
    concentratorTargetAssetsIsLoading ||
    concentratorsListIsLoading ||
    isLoadingHoldingsVault ||
    !ready

  return (
    <VaultTable label="Holdings" useAPR>
      {!isConnected ? (
        <TableDisconnected heading="Oops! It looks like you are not connected...">
          Connect your wallet to start exploring our Vaults.
        </TableDisconnected>
      ) : showLoadingState ? (
        <TableLoading>Loading concentrators...</TableLoading>
      ) : !supportedChain ? (
        <TableEmpty heading="Unsupported network">
          Please switch to a supported network to view Concentrators.
        </TableEmpty>
      ) : !concentratorsList?.length || !holdingsVaults?.vaults?.length ? (
        <TableEmpty heading="Well, this is awkward...">
          You don't appear to have any deposits in our Vaults. There's an easy
          way to change that.
        </TableEmpty>
      ) : (
        concentratorsList?.map(
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

export default ConcentratorHoldingsTable
