
import { useMemo } from 'react'
import { useNetwork } from 'wagmi'

const TOKEN_LOGOS_API_URL = "https://raw.githubusercontent.com/FortressFinance/assets/master/blockchains"

const getTokenLogoURI = (network = "ethereum", tokenAddress: `0x${string}` = '0x5E8422345238F34275888049021821E8E08CAa1e') => {
  // return `${TOKEN_LOGOS_API_URL}/${network}/assets/${tokenAddress}/logo.png` 
  // TODO - Handle various networks during testing - currently retrieve just from ethereum
  return `${TOKEN_LOGOS_API_URL}/ethereum/assets/${tokenAddress}/logo.png`
}

export default function useCurrencyLogoURI(token: `0x${string}`): { logoURI: string } {

  const { chain } = useNetwork()

  return useMemo(() => {
    const logoURI = getTokenLogoURI(chain?.name, token)

    return { logoURI }

  }, [token, chain])
}