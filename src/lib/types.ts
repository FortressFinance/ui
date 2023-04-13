import { Address } from "wagmi"

import { CompounderVaultStaticData } from "@/lib/api/vaults"

export type ProductType = "compounder" | "concentrator"

export type VaultType = "balancer" | "curve" | "token"

export type CompounderVaultProps = {
  asset: Address
  type: VaultType
  vaultAddress: Address
}

export type VaultDynamicProps = CompounderVaultProps & {
  poolId: CompounderVaultStaticData["id"] | undefined
}

export type FilterCategory =
  | "featured"
  | "crypto"
  | "stable"
  | "balancer"
  | "curve"

export type ConcentratorVaultProps = {
  primaryAsset: Address
  targetAsset: Address
  type: VaultType
}
