import { useState } from "react"

import useClientEffect from "@/hooks/useClientEffect"

export const useClientReady = () => {
  const [ready, setReady] = useState(false)
  useClientEffect(() => setReady(true))
  return ready
}
