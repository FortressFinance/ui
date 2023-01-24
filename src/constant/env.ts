import { arbitrumFork, arbitrumForkProvider, mainnetFork, mainnetForkProvider } from "@/constant/chains"
import { ChainProviderFn } from "wagmi"
import { arbitrum, Chain } from "wagmi/chains"
import { infuraProvider } from "wagmi/providers/infura"

export const isProd = process.env.NODE_ENV === "production"
export const isLocal = process.env.NODE_ENV === "development"

export const showLogger = isLocal
  ? true
  : process.env.NEXT_PUBLIC_SHOW_LOGGER === "true" ?? false

export const INFURA_KEY = process.env.NEXT_PUBLIC_INFURA_KEY ?? ""
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? ""
export const REGISTRY_ADDRESS = (process.env.NEXT_PUBLIC_REGISTRY_ADDRESS ??
  "0x") as `0x${string}`

const DEV_CHAINS: Chain[] = []
const DEV_PROVIDERS: ChainProviderFn[] = []
const PROD_CHAINS: Chain[] = []
const PROD_PROVIDERS: ChainProviderFn[] = []

const network_declared = [
  { name: "Mainnet fork", supported: process.env.NEXT_PUBLIC_MAINNETFORK_SUPPORTED ?? "" },
  { name: "Arbitrum fork", supported: process.env.NEXT_PUBLIC_ARBITRUMFORK_SUPPORTED ?? "" },
  { name: "Arbitrum One", supported: process.env.NEXT_PUBLIC_ARBITRUM_SUPPORTED ?? "" }
]
network_declared.map((networkVar) => {
  const upNetwork = networkVar.supported.toUpperCase()
  const network = networkVar.name === "Mainnet fork" ? mainnetFork : (networkVar.name === "Arbitrum fork" ? arbitrumFork : arbitrum)
  const provider = networkVar.name === "Mainnet fork" ? mainnetForkProvider() : (networkVar.name === "Arbitrum fork" ? arbitrumForkProvider() : infuraProvider({ apiKey: INFURA_KEY }))
  if (upNetwork === "DEV") {
    DEV_CHAINS.push(network)
    DEV_PROVIDERS.push(provider)
  }
  else if (upNetwork == "PROD") {
    PROD_CHAINS.push(network)
    PROD_PROVIDERS.push(provider)
  }
})

export const CHAIN_ID = isLocal ? (DEV_CHAINS.length > 0 ? DEV_CHAINS[0].id : undefined) : (PROD_CHAINS.length > 0 ? PROD_CHAINS[0].id : undefined)

const isDev = CHAIN_ID === undefined || PROD_CHAINS.length == 0 || (DEV_CHAINS.length !== 0 && DEV_CHAINS.filter(ch => ch.id === CHAIN_ID).length !== 0)
export const ENABLE_CHAINS = isDev ? DEV_CHAINS : PROD_CHAINS
export const ENABLE_PROVIDERS = isDev
  ? DEV_PROVIDERS
  : PROD_PROVIDERS