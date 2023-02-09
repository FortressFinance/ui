export const isProd = process.env.NODE_ENV === "production"
export const isLocal = process.env.NODE_ENV === "development"
export const showLogger = isLocal
  ? true
  : process.env.NEXT_PUBLIC_SHOW_LOGGER === "true" ?? false
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? ""
export const CURVE_GRAPH_URL = process.env.NEXT_PUBLIC_CURVE_GRAPH_URL ?? ""
export const AURA_GRAPH_URL = process.env.NEXT_PUBLIC_AURA_GRAPH_URL ?? ""
export const AURA_FINANCE_URL = process.env.NEXT_PUBLIC_AURA_FINANCE_URL ?? ""
export const LLAMA_URL = process.env.NEXT_PUBLIC_LLAMA_URL ?? ""
export const CONVEX_STAKING_URL =
  process.env.NEXT_PUBLIC_CONVEX_STAKING_URL ?? ""
export const GXM_GRAPH_URL = process.env.NEXT_PUBLIC_GXM_GRAPH_URL ?? ""
export const AURA_ADDRESS = process.env.NEXT_PUBLIC_AURA_ADDRESS ?? "0x"
export const AURA_BAL_ADDRESS = process.env.NEXT_PUBLIC_AURA_BAL_ADDRESS ?? "0x"
export const GLP_REWARDS_DISTRIBUTOR_ADDRESS =
  process.env.NEXT_PUBLIC_GLP_REWARDS_DISTRIBUTOR_ADDRESS ?? "0x"
const default_from_env = Number(process.env.NEXT_PUBLIC_DEFAULT_SLIPPAGE)
export const DEFAULT_SLIPPAGE = !isNaN(default_from_env)? default_from_env : 0.05
