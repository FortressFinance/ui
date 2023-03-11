import { Address } from "wagmi"

import { PreviewData } from "@/lib/api/vaults"
import { VaultType } from "@/lib/types"

export type PreviewTransactionArgs = {
  chainId: number
  id?: number
  token?: Address
  amount: string
  type: VaultType
  enabled?: boolean
  onSuccess?: (data: PreviewData) => void
  onError?: (err: unknown) => void
}

export type PreviewVaultSpecificTransactionArgs = Omit<
  PreviewTransactionArgs,
  "type"
> & {
  slippage: number
}

export type PreviewTransactionGetterArgs = Omit<
  PreviewVaultSpecificTransactionArgs,
  "onSuccess" | "onError" | "enabled"
> & {
  isCurve?: boolean
}
