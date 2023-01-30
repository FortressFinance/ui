import { Address } from "wagmi"

import { ApiPool } from "@/hooks/api/useApiCompounderPools"

export type VaultType = "balancer" | "curve" | "token"

export type VaultProps = {
  address: Address
  type: VaultType
}

export type VaultDynamicProps = VaultProps & {
  poolId: ApiPool["poolId"] | undefined
}

export type VaultDepositWithdrawProps = VaultProps & {
  underlyingAssets: Address[]
}
