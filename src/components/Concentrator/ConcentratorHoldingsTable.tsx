import { FC } from "react"
import { Address, useAccount } from "wagmi"

import { resolvedRoute } from "@/lib/helpers"
import { VaultType } from "@/lib/types"
import { enabledNetworks } from "@/lib/wagmi"
import {
  useActiveChainId,
  useClientReady,
  useConcentratorTargetAssets,
  useConcentratorVault,
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
    useHoldingsVaults({ isCompounder: false })

  const showLoadingState =
    concentratorTargetAssetsIsLoading ||
    concentratorsListIsLoading ||
    isLoadingHoldingsVault ||
    !ready

  return (
    <VaultTable label="Holdings" productType="concentrator">
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
            <HoldingsRow
              key={`concentrator-${i}`}
              targetAsset={concentratorTargetAsset}
              type={vaultType}
              primaryAsset={primaryAsset}
            />
          )
        )
      )}
    </VaultTable>
  )
}

export default ConcentratorHoldingsTable

type HoldingsRowProps = {
  primaryAsset: Address
  targetAsset: Address
  type: VaultType
}

const HoldingsRow: FC<HoldingsRowProps> = ({
  primaryAsset,
  targetAsset,
  type,
  ...props
}) => {
  const concentrator = useConcentratorVault({
    targetAsset,
    primaryAsset,
    type,
  })
  const holdingsVaults = useHoldingsVaults({ isCompounder: false })

  const setStrategyLink = ({
    pathname,
    category,
  }: {
    pathname: string
    category?: string | string[]
  }) => {
    return resolvedRoute(pathname, {
      category: category,
      asset: targetAsset,
      type: type,
      vaultAddress: primaryAsset,
      productType: "concentrator",
      ybTokenAddress: concentrator.data.ybTokenAddress,
    })
  }

  if (!concentrator.data?.ybTokenAddress || holdingsVaults.isLoading)
    return <TableLoading>Loading holdings...</TableLoading>

  return holdingsVaults.data?.vaults?.includes(
    concentrator.data.ybTokenAddress
  ) ? (
    <VaultRow
      {...props}
      asset={targetAsset}
      type={type}
      vaultAddress={primaryAsset}
      setStrategyLink={setStrategyLink}
      productType="concentrator"
    />
  ) : null
}
