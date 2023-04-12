import { Address } from "wagmi"

import { PreviewData } from "@/lib/api/vaults"
import { VaultType } from "@/lib/types"

type PreviewTransactionBaseArgs = {
  chainId: number
  token?: Address
  amount: string
  enabled?: boolean
  onSuccess?: (data: PreviewData) => void
  onError?: (err: unknown) => void
}

export type PreviewTransactionArgs = PreviewTransactionBaseArgs & {
  id?: number
  type: VaultType
}

export type ConcentratorPreviewTransactionArgs = PreviewTransactionBaseArgs & {
  targetAssetId: number
  concentratorId: number
  isCurve: boolean
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

export type ConcentratorPreviewVaultSpecificTransactionArgs =
  ConcentratorPreviewTransactionArgs & {
    slippage: number
  }

export type ConcentratorPreviewTransactionGetterArgs = Omit<
  ConcentratorPreviewVaultSpecificTransactionArgs,
  "onSuccess" | "onError" | "enabled"
>
