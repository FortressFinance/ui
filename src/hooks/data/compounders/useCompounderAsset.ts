import { Address, useContractRead } from "wagmi"

import useActiveChainId from "@/hooks/useActiveChainId"

import { vaultCompounderAbi } from "@/constant/abi"

export function useCompounderAsset({ asset }: { asset?: Address }) {
  const chainId = useActiveChainId()
  return useContractRead({
    chainId,
    abi: vaultCompounderAbi,
    address: asset,
    functionName: "asset",
    enabled: !!asset,
  })
}
