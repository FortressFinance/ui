import { FC } from "react"
import { Address, useAccount } from "wagmi"

import { VaultType } from "@/lib/types"
import { enabledNetworks } from "@/lib/wagmi"
import {
  useActiveChainId,
  useClientReady,
  useCompounderVault,
  useHoldingsVaults,
  useListCompounders,
} from "@/hooks"

import { TableDisconnected, TableEmpty, TableLoading } from "@/components/Table"
import VaultRow from "@/components/Vault/VaultRow"
import { VaultTable } from "@/components/Vault/VaultTable"

const HoldingsTable: FC = () => {
  const ready = useClientReady()
  const { isConnected } = useAccount()
  const chainId = useActiveChainId()
  const availableChains = enabledNetworks.chains.filter((n) => n.id === chainId)
  const supportedChain = availableChains?.[0]

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
      ) : !supportedChain ? (
        <TableEmpty heading="Unsupported network">
          Please switch to a supported network to view Compounders.
        </TableEmpty>
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

type HoldingsRowProps = {
  asset: Address
  type: VaultType
}

export const HoldingsRow: FC<HoldingsRowProps> = (props) => {
  const vaultAddress = useCompounderVault({
    vaultAssetAddress: props.asset,
    vaultType: props.type,
  })
  const holdingsVaults = useHoldingsVaults()

  if (!vaultAddress.data?.ybTokenAddress || holdingsVaults.isLoading)
    return <TableLoading>Loading holdings...</TableLoading>

  return holdingsVaults.data?.vaults?.includes(
    vaultAddress.data.ybTokenAddress
  ) ? (
    <VaultRow {...props} vaultAddress={vaultAddress.data.ybTokenAddress} />
  ) : null
}
