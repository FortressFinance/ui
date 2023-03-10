import { toBool } from "@/lib/helpers/toBool"

export const isProd = process.env.NODE_ENV === "production"
export const isLocal = process.env.NODE_ENV === "development"
export const showLogger = isLocal
  ? true
  : process.env.NEXT_PUBLIC_SHOW_LOGGER === "true" ?? false
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? ""
export const CURVE_GRAPH_URL = process.env.NEXT_PUBLIC_CURVE_GRAPH_URL ?? ""
export const CONVEX_SIDECHAINS_URL =
  process.env.NEXT_PUBLIC_CONVEX_SIDECHAINS_URL ?? ""
export const AURA_GRAPH_URL = process.env.NEXT_PUBLIC_AURA_GRAPH_URL ?? ""
export const AURA_FINANCE_URL = process.env.NEXT_PUBLIC_AURA_FINANCE_URL ?? ""
export const LLAMA_URL = process.env.NEXT_PUBLIC_LLAMA_URL ?? ""
export const CONVEX_STAKING_URL =
  process.env.NEXT_PUBLIC_CONVEX_STAKING_URL ?? ""
export const GXM_GRAPH_URL = process.env.NEXT_PUBLIC_GXM_GRAPH_URL ?? ""
export const ALADDIN_URL = process.env.NEXT_PUBLIC_ALADDIN_URL ?? ""
export const APY_VISION_URL = process.env.NEXT_PUBLIC_APY_VISION_URL ?? ""
export const CURVE_FACTORY_URL = process.env.NEXT_PUBLIC_CURVE_FACTORY_URL ?? ""
export const CURVE_FACTORY_CRYPTO_URL =
  process.env.NEXT_PUBLIC_CURVE_FACTORY_CRYPTO_URL ?? ""
export const CURVE_MAIN_URL = process.env.NEXT_PUBLIC_CURVE_MAIN_URL ?? ""
export const AURA_ADDRESS = process.env.NEXT_PUBLIC_AURA_ADDRESS ?? "0x"
export const AURA_BAL_ADDRESS = process.env.NEXT_PUBLIC_AURA_BAL_ADDRESS ?? "0x"
export const GLP_REWARDS_DISTRIBUTOR_ADDRESS =
  process.env.NEXT_PUBLIC_GLP_REWARDS_DISTRIBUTOR_ADDRESS ?? "0x"
const defaultSlippageFromEnv = Number(process.env.NEXT_PUBLIC_DEFAULT_SLIPPAGE)
export const DEFAULT_SLIPPAGE = !isNaN(defaultSlippageFromEnv)
  ? defaultSlippageFromEnv
  : 0.05

const default_disable_concentrator = toBool(
  process.env.NEXT_PUBLIC_DISABLE_CONCENTRATOR
)
export const DISABLE_CONCENTRATORS = default_disable_concentrator
