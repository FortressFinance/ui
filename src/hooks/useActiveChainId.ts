import { useNetwork } from "wagmi"

import { useActiveChain } from "@/store/activeChain"

export default function useActiveChainId() {
  const { chain } = useNetwork()
  const disconnectedChainId = useActiveChain((state) => state.chainId)
  return chain?.id ?? disconnectedChainId
}
