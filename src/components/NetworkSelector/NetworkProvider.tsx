import { CHAIN_ID, ENABLE_CHAINS } from '@/constant/env'
import React, { Context, createContext, FC, PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react'
import { Chain, useNetwork, useSwitchNetwork } from 'wagmi'

type NetworkContextType = {
  chain: Chain | undefined
  chains: Chain[]
  switchActiveNetwork: ((chainId_: number) => void) | undefined
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined)

export function useActiveNetwork(): NetworkContextType {
  const context = useContext(NetworkContext as Context<NetworkContextType | undefined>)
  if (!context) throw Error('useActiveNetwork can only be used within the NetworkProvider component')
  return context
}

const NetworkProvider: FC<PropsWithChildren> = ({ children }) => {
  const { chain } = useNetwork()
  const { chains, isLoading, switchNetwork } = useSwitchNetwork({
    throwForSwitchChainNotSupported: true,
  })
  const [activeChain, setActiveChain] = useState<Chain | undefined>(undefined)
  const [activeChains, setActiveChains] = useState<(Chain | undefined)[]>([])

  const switchActiveNetwork = useCallback((chainId_: number) => {
    if (chain === undefined) {    // not connected to wallet
      setActiveChain(activeChains.filter((value) => value !== undefined && value.id === chainId_)?.[0])
    } else {
      switchNetwork?.(chainId_)
    }
  }, [JSON.stringify(activeChains), isLoading])

  useEffect(() => {
    if (chains.length === 0) {
      setActiveChains(ENABLE_CHAINS)
    }
    else {
      setActiveChains(chains)
    }
  }, [isLoading, JSON.stringify(ENABLE_CHAINS)])

  useEffect(() => {
    const previousChainId = activeChain !== undefined ? activeChain.id : CHAIN_ID
    setActiveChain(chain ?? activeChains?.filter((value) => value !== undefined && value.id === previousChainId)?.[0])
  }, [chain, JSON.stringify(activeChains)])

  return (
    <NetworkContext.Provider value={{ chain: activeChain, chains: activeChains, switchActiveNetwork }} >
      {children}
    </NetworkContext.Provider>
  )
}

export default NetworkProvider