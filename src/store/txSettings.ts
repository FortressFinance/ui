import { create } from "zustand"

import { DEFAULT_SLIPPAGE } from "@/constant/env"

export interface TxSettingsStore {
  slippageToleranceString: string
  txDeadlineMinutes: number
  setSlippageToleranceString: (_slippageToleranceString: string) => void
  setTxDeadlineMinutes: (_txDeadlineMinutes: number) => void
}

export const useTxSettings = create<TxSettingsStore>((set, _get) => ({
  // we store slippage tolerance as a string for better UX
  // with the value as a number, we lose the decimal place if there are no digits following it
  // e.g. if a user has "0.05" in the input and presses backspace twice, the input will show "0" instead of "0."
  slippageToleranceString: DEFAULT_SLIPPAGE,
  txDeadlineMinutes: 30,
  setSlippageToleranceString: (slippageToleranceString) =>
    set({ slippageToleranceString }),
  setTxDeadlineMinutes: (txDeadlineMinutes) => set({ txDeadlineMinutes }),
}))

// convenience hook for retrieving the number for use in contract functions
export const useSlippageTolerance = () => {
  const slippageToleranceString = useTxSettings(
    (state) => state.slippageToleranceString
  )
  return Number(slippageToleranceString)
}
