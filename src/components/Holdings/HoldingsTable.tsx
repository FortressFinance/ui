import { FC } from "react"
import { useAccount } from "wagmi"

import { useListCompounders } from "@/hooks/data/compounders"
import { useHoldingsVaults } from "@/hooks/data/holdings/useHoldingsVaults"
import { useClientReady } from "@/hooks/util"

import { HoldingsRow } from "@/components/Holdings/HoldingsRow"
import { TableDisconnected, TableEmpty, TableLoading } from "@/components/Table"
import { VaultTable } from "@/components/Vault/VaultTable"

const HoldingsTable: FC = () => {
  // handle hydration mismatch
  const ready = useClientReady()
  const { isConnected } = useAccount()

  const { data: compoundersList, isLoading } = useListCompounders()
  const { data: holdingsVaults, isLoading: isLoadingHoldingsVault } =
    useHoldingsVaults()

  const showLoadingState = isLoading || isLoadingHoldingsVault || !ready

  return (
    <VaultTable label="Holdings">
      {/* Table body */}
      {!isConnected ? (
        <TableDisconnected heading="Oops! It looks like you are not connected...">
          Connect your wallet to start exploring our Vaults.
        </TableDisconnected>
      ) : showLoadingState ? (
        <TableLoading>Loading holdings...</TableLoading>
      ) : !compoundersList?.length || !holdingsVaults?.vaults?.length ? (
        <TableEmpty heading="Well, this is awkward...">
          You don't appear to have any deposits in our Vaults. There's an easy
          way to change that.
        </TableEmpty>
      ) : (
        compoundersList.map((vault, index) => (
          <HoldingsRow
            key={`pool-${vault.vaultType}-${index}`}
            asset={vault.vaultAssetAddress}
            type={vault.vaultType}
          />
        ))
      )}
    </VaultTable>
  )
}

export default HoldingsTable
