export const isProd = process.env.NODE_ENV === "production"
export const isLocal = process.env.NODE_ENV === "development"

export const showLogger = isLocal
  ? true
  : process.env.NEXT_PUBLIC_SHOW_LOGGER === "true" ?? false

export const INFURA_KEY = process.env.NEXT_PUBLIC_INFURA_KEY ?? ""
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? ""
export const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? "42161")
export const REGISTRY_ADDRESS = (process.env.NEXT_PUBLIC_REGISTRY_ADDRESS ??
  "0x") as `0x${string}`
