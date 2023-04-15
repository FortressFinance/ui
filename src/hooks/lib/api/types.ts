import { Address } from "wagmi"

import { PreviewData } from "@/lib/api/vaults"
import { VaultProps } from "@/lib/types"

import { VaultRowPropsWithProduct } from "@/components/VaultRow"

type PreviewTransactionArgs = {
  chainId: number
  token?: Address
  amount: string
  enabled?: boolean
  onSuccess?: (data: PreviewData) => void
  onError?: (err: unknown) => void
}

export type PreviewTransactionBaseArgs = VaultRowPropsWithProduct &
  PreviewTransactionArgs
export type VaultPreviewTransactionArgs = VaultProps & PreviewTransactionArgs

export type CompounderPreviewTransactionArgs = VaultPreviewTransactionArgs & {
  id?: number
}

export type ConcentratorPreviewTransactionArgs = VaultPreviewTransactionArgs & {
  isCurve: boolean
}

export type CompounderPreviewVaultSpecificTransactionArgs = Omit<
  CompounderPreviewTransactionArgs,
  "type" | "asset" | "vaultAddress"
> & {
  slippage: number
}

export type CompounderPreviewTransactionGetterArgs = Omit<
  CompounderPreviewVaultSpecificTransactionArgs,
  "onSuccess" | "onError" | "enabled"
> & {
  isCurve?: boolean
}

export type ConcentratorPreviewVaultSpecificTransactionArgs = Omit<
  ConcentratorPreviewTransactionArgs,
  "type" | "primaryAsset" | "targetAsset"
> & {
  slippage: number
}

export type ConcentratorPreviewTransactionGetterArgs = Omit<
  ConcentratorPreviewVaultSpecificTransactionArgs,
  "onSuccess" | "onError" | "enabled"
>
