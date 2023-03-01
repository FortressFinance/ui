import { create } from "zustand"

import { DEFAULT_SLIPPAGE } from "@/constant/env"

export interface TxSettingsStore {
  slippageTolerance: number
  txDeadlineMinutes: number
  setSlippageTolerance: (_slippageTolerance: number) => void
  setTxDeadlineMinutes: (_txDeadlineMinutes: number) => void
}

export const useTxSettings = create<TxSettingsStore>((set, _get) => ({
  // we store slippage tolerance as a string for better UX
  // with the value as a number, we lose the decimal place if there are no digits following it
  // e.g. if a user has "0.05" in the input and presses backspace twice, the input will show "0" instead of "0."
  slippageTolerance: DEFAULT_SLIPPAGE,
  txDeadlineMinutes: 30,
  setSlippageTolerance: (slippageTolerance) => set({ slippageTolerance }),
  setTxDeadlineMinutes: (txDeadlineMinutes) => set({ txDeadlineMinutes }),
}))
