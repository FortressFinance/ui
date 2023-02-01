import { Address } from "wagmi"

import { ApiPool } from "@/hooks/api/useApiCompounderPools"

export type VaultType = "balancer" | "curve" | "stable" | "featured" | "crypto"

export type VaultProps = {
  asset: Address | undefined
  type: VaultType
}

export type VaultDynamicProps = VaultProps & {
  poolId: ApiPool["poolId"] | undefined
}
