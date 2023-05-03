import { useState } from "react"
import { useDebounce } from "react-use"

// Helper hook to debounce a single value
// Returns the debounced value and a boolean indicating if the value is ready
// Dependency array is used to reset the debounce timer and reduce unnecessary renders

export const useDebouncedValue = <T>(
  value: T,
  delay: number,
  deps: Array<unknown>
): [T, boolean] => {
  const [debouncedValue, setDebouncedValue] = useState(value)
  const [debounceReady] = useDebounce(
    () => setDebouncedValue(value),
    delay,
    deps
  )
  return [debouncedValue, debounceReady() ?? false]
}
