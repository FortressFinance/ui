import { FC } from "react"

import { VaultProps } from "@/lib/types"
import { useCompounderVault } from "@/hooks/data/compounders"
import { useHoldingsVaults } from "@/hooks/data/holdings/useHoldingsVaults"

import { TableCell } from "@/components/Table"
import VaultRow from "@/components/Vault/VaultRow"

export const HoldingsRow: FC<VaultProps> = (props) => {
  const vaultAddress = useCompounderVault({
    vaultAssetAddress: props.asset ?? "0x",
    vaultType: props.type,
  })
  const ybTokenAddress = vaultAddress.data?.ybTokenAddress
  const { data: holdingsVaults, isLoading: isLoadingHoldingsVault } =
    useHoldingsVaults()
  const earnColumn = (
    <TableCell className="pointer-events-none text-center max-md:hidden">
      $0.0
    </TableCell>
  )
  return isLoadingHoldingsVault ||
    !(holdingsVaults?.vaults ?? []).includes(ybTokenAddress ?? "0x") ? null : (
    <VaultRow
      {...props}
      vaultAddress={ybTokenAddress}
      extendedColumns={earnColumn}
      extendedClassName="md:grid-cols-[4fr,1fr,1fr,1fr,1fr,3.5rem]"
    />
  )
}
