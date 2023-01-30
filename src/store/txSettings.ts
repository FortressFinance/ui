import { create } from "zustand"

export interface TxSettingsStore {
  isSlippageAuto: boolean
  slippageTolerance: number
  txDeadlineMinutes: number
  toggleSlippageAuto: () => void
  setSlippageTolerance: (_slippageTolerance: number) => void
  setTxDeadlineMinutes: (_txDeadlineMinutes: number) => void
}

export const useTxSettings = create<TxSettingsStore>((set, _get) => ({
  isSlippageAuto: true,
  slippageTolerance: 0.05,
  txDeadlineMinutes: 30,
  toggleSlippageAuto: () =>
    set(({ isSlippageAuto }) => ({ isSlippageAuto: !isSlippageAuto })),
  setSlippageTolerance: (slippageTolerance) => set({ slippageTolerance }),
  setTxDeadlineMinutes: (txDeadlineMinutes) => set({ txDeadlineMinutes }),
}))
