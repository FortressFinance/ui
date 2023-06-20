import { localhost } from "viem/chains"
import { mainnet } from "wagmi"

import { arbitrumFork, mainnetFork } from "@/lib/wagmi"
import { useActiveChainId } from "@/hooks/useActiveChainId"
import { useClientReady } from "@/hooks/useClientReady"

import {
  arbitrumConfig,
  arbitrumForkConfig,
  localhostConfig,
  mainnetConfig,
  mainnetForkConfig,
} from "@/constant/chainConfig"

// This hook is used to get the chain config for the active chain
// Defaults to arbitrumConfig if the client is not ready
export const useActiveChainConfig = () => {
  const isClientReady = useClientReady()
  const activeChainId = useActiveChainId()
  return isClientReady
    ? activeChainId === mainnet.id
      ? mainnetConfig
      : activeChainId === mainnetFork.id
      ? mainnetForkConfig
      : activeChainId === arbitrumFork.id
      ? arbitrumForkConfig
      : activeChainId === localhost.id
      ? localhostConfig
      : arbitrumConfig
    : arbitrumConfig
}
