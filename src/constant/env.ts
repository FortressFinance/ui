import { ChainProviderFn } from "wagmi"
import { arbitrum, Chain } from "wagmi/chains"
import { infuraProvider } from "wagmi/providers/infura"

import { arbitrumFork, fortressForkProvider, mainnetFork } from "@/constant/chains"

export const isProd = process.env.NODE_ENV === "production"
export const isLocal = process.env.NODE_ENV === "development"

export const showLogger = isLocal
  ? true
  : process.env.NEXT_PUBLIC_SHOW_LOGGER === "true" ?? false

export const INFURA_KEY = process.env.NEXT_PUBLIC_INFURA_KEY ?? ""
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? ""
export const REGISTRY_ADDRESS = (process.env.NEXT_PUBLIC_REGISTRY_ADDRESS ??
  "0x") as `0x${string}`

export const ENABLE_CHAINS: Chain[] = []
export const ENABLE_PROVIDERS: ChainProviderFn[] = []

const network_declared = [
  { name: "Mainnet fork", supported: process.env.NEXT_PUBLIC_MAINNETFORK_SUPPORTED ?? "false" },
  { name: "Arbitrum fork", supported: process.env.NEXT_PUBLIC_ARBITRUMFORK_SUPPORTED ?? "false" },
  { name: "Arbitrum One", supported: process.env.NEXT_PUBLIC_ARBITRUM_SUPPORTED ?? "false" }
]

let forkProviderAlreadyAdded = false
network_declared.map((networkVar) => {
  const isSupported = Boolean(JSON.parse(networkVar.supported));
  const network = networkVar.name.toLocaleUpperCase() === "MAINNET FORK" ? mainnetFork : (networkVar.name.toLocaleUpperCase() === "ARBITRUM FORK" ? arbitrumFork : arbitrum)
  let provider: ChainProviderFn | undefined = undefined
  if (["MAINNET FORK", "ARBITRUM FORK"].includes(networkVar.name.toLocaleUpperCase())) {
    if(!forkProviderAlreadyAdded){
      forkProviderAlreadyAdded = true
      provider = fortressForkProvider()
    }
  }
  else {
    provider = infuraProvider({ apiKey: INFURA_KEY })
  }
  if (isSupported) {
    ENABLE_CHAINS.push(network)

    if (provider) {
      ENABLE_PROVIDERS.push(provider)
    }
  }
})

export const CHAIN_ID = ENABLE_CHAINS.length > 0 ? ENABLE_CHAINS[0].id : undefined