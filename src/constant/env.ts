import { toBool } from "@/lib/helpers/toBool"

export const isProd = process.env.NODE_ENV === "production"
export const isLocal = process.env.NODE_ENV === "development"
export const showLogger = isLocal
  ? true
  : process.env.NEXT_PUBLIC_SHOW_LOGGER === "true" ?? false
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? ""
export const DISABLE_CONCENTRATORS = toBool(
  process.env.NEXT_PUBLIC_DISABLE_CONCENTRATOR
)
export const DEFAULT_SLIPPAGE = !isNaN(
  Number(process.env.NEXT_PUBLIC_DEFAULT_SLIPPAGE)
)
  ? Number(process.env.NEXT_PUBLIC_DEFAULT_SLIPPAGE)
  : 0.05
