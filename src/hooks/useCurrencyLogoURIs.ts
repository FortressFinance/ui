import { useMemo } from "react"

import useActiveChainId from "@/hooks/useActiveChainId"

import { enabledNetworks } from "@/components/AppProviders"

const TOKEN_LOGOS_API_URL =
  "https://raw.githubusercontent.com/FortressFinance/assets/master/blockchains"

const getTokenLogoURI = (
  networkName: string | undefined,
  tokenAddress: `0x${string}`
) => {
  let network = "ethereum" //default

  switch (networkName) {
    case "ethereum":
    case "mainnet":
    case "mainnetFork":
      network = "ethereum"
      break
    case "arbitrum":
    case "arbitrumFork":
      network = "arbitrum"
      break
    default:
      network = "ethereum"
  }

  return `${TOKEN_LOGOS_API_URL}/${network}/assets/${tokenAddress}/logo.png`
}

export default function useCurrencyLogoURI(token: `0x${string}`): {
  logoURI: string
} {
  const chainId = useActiveChainId()
  const availableChains = enabledNetworks.chains.filter((n) => n.id === chainId)
  const supportedChain = availableChains?.[0]
  const network = supportedChain?.network

  return useMemo(() => {
    const logoURI = getTokenLogoURI(network, token)

    return { logoURI }
  }, [token, network])
}
