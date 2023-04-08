import { useMemo } from "react"
import { Address } from "wagmi"

import { VaultType } from "@/lib/types"
import { useConcentratorVaultTypeByAsset } from "@/hooks/useConcentratorVaultTypeByAsset"

export function useIsCurveVault(type: VaultType) {
  return useMemo(() => type === "curve", [type])
}

export function useIsTokenVault(type: VaultType) {
  return useMemo(() => type === "token", [type])
}

export function useIsConcentratorCurveVault(asset: Address) {
  const vaultTypeAvailable = useConcentratorVaultTypeByAsset()
  return useMemo(
    () =>
      vaultTypeAvailable[asset] !== undefined &&
      vaultTypeAvailable[asset] === "curve",
    [asset, vaultTypeAvailable]
  )
}

export function useIsConcentratorTokenVault(asset: Address) {
  const vaultTypeAvailable = useConcentratorVaultTypeByAsset()
  return useMemo(
    () =>
      vaultTypeAvailable[asset] !== undefined &&
      vaultTypeAvailable[asset] === "token",
    [asset, vaultTypeAvailable]
  )
}
