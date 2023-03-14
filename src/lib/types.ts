import { ReactNode } from "react"
import { Address } from "wagmi"

import { CompounderVaultStaticData } from "@/lib/api/vaults"

export type VaultType = "balancer" | "curve" | "token"

export type VaultProps = {
  asset?: Address
  type: VaultType
  vaultAddress?: Address
  extendedColumns?: ReactNode
  extendedClassName?:string
}

export type VaultDynamicProps = VaultProps & {
  poolId: CompounderVaultStaticData["id"] | undefined
}

export type FilterCategory =
  | "featured"
  | "crypto"
  | "stable"
  | "balancer"
  | "curve"
