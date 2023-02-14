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

export type ConcentratorType =
  | "balancerAuraBal"
  | "balancerEth"
  | "curveCvxCrv"
  | "curveEth"
