import { Address } from "wagmi"

import { ApiPool } from "@/hooks/api/useApiCompounderPools"

export type VaultType = "balancer" | "curve"

export type VaultProps = {
  address: Address
  type: VaultType
}

export type VaultDynamicProps = VaultProps & {
  poolId: ApiPool["poolId"] | undefined
}
