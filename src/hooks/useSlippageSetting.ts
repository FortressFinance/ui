import { useTxSettings } from "@/store/txSettings"

import { DEFAULT_SLIPPAGE } from "@/constant/env"

export const useSlippageSetting = () => {
  const [isSlippageAuto, slippageTolerance] = useTxSettings((state) => [
    state.isSlippageAuto,
    state.slippageTolerance,
  ])
  return isSlippageAuto ? DEFAULT_SLIPPAGE : slippageTolerance
}
