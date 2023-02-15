import { Address } from "wagmi"

import { CompounderVaultStaticData } from "@/lib/api/vaults"

export type VaultType = "balancer" | "curve" | "token"

export type VaultProps = {
  asset: Address | undefined
  type: VaultType
}

export type VaultDynamicProps = VaultProps & {
  poolId: CompounderVaultStaticData["poolId"] | undefined
}

export type ConcentratorType = "curve" | "balancer" | "solidly"
export type ConcentratorTargetAsset = "auraBAL" | "ETH" | "cvxCRV"

export type FilterCategory =
  | "featured"
  | "crypto"
  | "stable"
  | "balancer"
  | "curve"
