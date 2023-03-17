import { createQueryKeyStore } from "@lukemorales/query-key-factory"
import { Address } from "wagmi"

import { PreviewTransactionGetterArgs } from "@/hooks/data/preview"

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
    apy: ({ asset }: { asset: Address | undefined }) => ["apy", asset ?? "0x"],
    apr: ({ asset }: { asset: Address | undefined }) => ["apr", asset ?? "0x"],
    previewTokenDeposit: (args: PreviewTransactionGetterArgs) => [args],
    previewDeposit: (args: PreviewTransactionGetterArgs) => [args],
    previewTokenRedeem: (args: PreviewTransactionGetterArgs) => [args],
    previewRedeem: (args: PreviewTransactionGetterArgs) => [args],
  },
  concentrators: {
    list: ({ chainId }: { chainId: number }) => [chainId],
    detail: ({
      chainId,
      compounderType,
    }: {
      chainId: number
      compounderType: string
    }) => [chainId, compounderType],
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
    priceUsd: ({ asset, amount }: { asset?: Address; amount?: number }) => [
      asset ?? "0x",
      amount,
    ],
  },
})
