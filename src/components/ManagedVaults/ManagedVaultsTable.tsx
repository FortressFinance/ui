import { FC } from "react"

import { capitalizeFirstLetter } from "@/lib/helpers"
import { FilterCategory } from "@/lib/types"
import { enabledNetworks } from "@/lib/wagmi"
import { useClientReady } from "@/hooks"
import { useActiveChainId } from "@/hooks"

import { TableEmpty, TableLoading } from "@/components/Table"
import { VaultRow } from "@/components/VaultRow"
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const metaVaults: any[] = [
    {
      asset: "0x7f90122BF0700F9E7e1F688fe926940E8839F353",
      vaultType: "curve",
      vaultAddress: "0xadAD55f56C23cF8B1286A3419bFeed055F1aDcb0",
    },
  ]

  return (
    <VaultTable label={`${displayName} Managed Vaults`} showEarningsColumn>
      {showLoadingState ? (
        <TableLoading>Loading managed vaults...</TableLoading>
      ) : !supportedChain ? (
        <TableEmpty heading="Unsupported network">
          Please switch to a supported network to view the related managed
          vaults.
        </TableEmpty>
      ) : !metaVaults?.length ? (
        <TableEmpty heading="Where Managed Vaults ser?">
          It seems we don't have {displayName} Managed Vaults on {network}{" "}
          (yet). Feel free to check out other products on {network} or change
          networks. New managed vaults and strategies are added often, so check
          back later. Don't be a stranger.
        </TableEmpty>
      ) : (
        metaVaults?.map((el, i) => (
          <VaultRow
            key={`metaVault-${i}`}
            asset={el.asset}
            type={el.vaultType}
            vaultAddress={el.vaultAddress}
            productType="managedVaults"
          />
        ))
      )}
    </VaultTable>
  )
}
