import { FC } from "react"

import { VaultProps } from "@/lib/types"
import { useCompounderVault, useHoldingsVaults } from "@/hooks"

import VaultRow from "@/components/Vault/VaultRow"

export const HoldingsRow: FC<VaultProps> = (props) => {
  const vaultAddress = useCompounderVault({
    vaultAssetAddress: props.asset ?? "0x",
    vaultType: props.type,
  })
  const ybTokenAddress = vaultAddress.data?.ybTokenAddress
  const { data: holdingsVaults, isLoading: isLoadingHoldingsVault } =
    useHoldingsVaults()
  return isLoadingHoldingsVault ||
    !(holdingsVaults?.vaults ?? []).includes(ybTokenAddress ?? "0x") ? null : (
    <VaultRow {...props} vaultAddress={ybTokenAddress} />
  )
}
