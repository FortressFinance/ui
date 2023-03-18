/* eslint-disable no-console */
import { showLogger } from "@/constant/env"

export function fortLog(object: unknown, comment?: string): void {
  if (!showLogger) return

  console.log(
    "%c ============== INFO LOG \n",
    "color: #22D3EE",
    `${typeof window !== "undefined" && window?.location.pathname}\n`,
    `=== ${comment ?? ""}\n`,
    object
  )
}
