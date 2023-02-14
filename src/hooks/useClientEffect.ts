import { DependencyList, EffectCallback, useEffect } from "react"

// useEffect that only runs in the browser (i.e. not during server rendering)
export const useClientEffect = (
  effect: EffectCallback,
  deps?: DependencyList
) => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      effect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

export default useClientEffect
