import { FC } from "react"

import { capitalizeFirstLetter } from "@/lib/helpers"
import { FilterCategory } from "@/lib/types"
import { enabledNetworks } from "@/lib/wagmi"
import { useClientReady } from "@/hooks"
import { useActiveChainId } from "@/hooks"

import { TableEmpty, TableLoading } from "@/components/Table"
import { VaultTable } from "@/components/VaultRow/lib"

type ManagedVaultsTableProps = {
  filterCategory?: FilterCategory
}

export const ManagedVaultsTable: FC<ManagedVaultsTableProps> = ({
  filterCategory,
}) => {
  // handle hydration mismatch
  const clientReady = useClientReady()
  const chainId = useActiveChainId()
  const availableChains = enabledNetworks.chains.filter((n) => n.id === chainId)
  const supportedChain = availableChains?.[0]
  const network = supportedChain?.name

  const displayName = capitalizeFirstLetter(filterCategory ?? "")
  const showLoadingState = !clientReady

  return (
    <VaultTable label={`${displayName} Managed Vaults`} showEarningsColumn>
      {showLoadingState ? (
        <TableLoading>Loading managed vaults...</TableLoading>
      ) : !supportedChain ? (
        <TableEmpty heading="Unsupported network">
          Please switch to a supported network to view the related managed
          vaults.
        </TableEmpty>
      ) : (
        <TableEmpty heading="Where Managed Vaults ser?">
          It seems we don't have {displayName} Managed Vaults on {network}{" "}
          (yet). Feel free to check out other product on {network} or change
          network. New managed vaults and strategies are added often, so check
          back later. Don't be a stranger.
        </TableEmpty>
      )}
    </VaultTable>
  )
}
