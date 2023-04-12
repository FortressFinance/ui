import { createQueryKeyStore } from "@lukemorales/query-key-factory"
import { Address } from "wagmi"

import {
  ConcentratorPreviewTransactionGetterArgs,
  PreviewTransactionGetterArgs,
} from "@/hooks/lib/api/types"

export const queryKeys = createQueryKeyStore({
  vaults: {
    list: ({ chainId, type }: { chainId: number; type: string }) => [
      chainId,
      type,
    ],
    detail: ({
      id,
      chainId,
      user,
      type,
    }: {
      id: number | undefined
      chainId: number
      user: Address | undefined
      type: string
    }) => [chainId, type, id, user ?? "0x"],
    apy: ({ asset }: { asset: Address }) => ["apy", asset],
    apr: ({ asset }: { asset: Address }) => ["apr", asset],
    previewDeposit: (args: PreviewTransactionGetterArgs) => [args],
    previewRedeem: (args: PreviewTransactionGetterArgs) => [args],
  },
  concentrators: {
    list: ({ chainId }: { chainId: number }) => [chainId],
    detail: ({
      targetAssetId,
      concentratorId,
      chainId,
      user,
      type,
    }: {
      targetAssetId: number
      concentratorId: number
      chainId: number
      user: Address | undefined
      type: string
    }) => [chainId, type, targetAssetId, concentratorId, user ?? "0x"],
    previewDeposit: (args: ConcentratorPreviewTransactionGetterArgs) => [args],
  },
  holdings: {
    list: ({
      chainId,
      user,
    }: {
      chainId: number
      user: Address | undefined
    }) => [chainId, user ?? "0x"],
  },
  tokens: {
    priceUsd: ({ asset = "0x" }: { asset: Address }) => [asset],
  },
})
