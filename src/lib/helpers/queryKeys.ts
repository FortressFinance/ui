import { createQueryKeyStore } from "@lukemorales/query-key-factory"
import { Address } from "wagmi"

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
    apr: ({ asset }: { asset: Address | undefined }) => [asset ?? "0x"],
    previewDeposit: ({ chainId,
      isCurve,
      id,
      token = "0x",
      amount,
      slippage }: {
      chainId: number
      isCurve: boolean
      id: number | undefined
      token: Address | undefined,
      amount: string,
      slippage: number
    }) => [isCurve, id, token, chainId, amount, slippage],
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
})
