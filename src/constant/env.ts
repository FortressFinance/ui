// environments
export const isProd = process.env.NODE_ENV === "production"
export const isLocal = process.env.NODE_ENV === "development"

// logging
export const showLogger = isLocal
  ? true
  : process.env.NEXT_PUBLIC_SHOW_LOGGER === "true" ?? false

// api + contract info
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? ""
