import { useEffect } from "react"
import { formatUnits } from "viem"
import { useContractReads } from "wagmi"

import { useActiveChainId } from "@/hooks/useActiveChainId"

import { AMMCompounderBase, GlpManager } from "@/constant/abi"
import { glpManagerAddress, glpTokenAddress } from "@/constant/addresses"

export function useGlpPrice({ enabled }: { enabled?: boolean }) {
  const chainId = useActiveChainId()
  const isArbitrumFamily = chainId === 313371 || chainId === 42161
  const queries = useContractReads({
    contracts: [
      {
        chainId,
        address: glpManagerAddress,
        abi: GlpManager,
        functionName: "getPrice",
        args: [false],
      },
      {
        chainId,
        address: glpManagerAddress,
        abi: GlpManager,
        functionName: "getAumInUsdg",
        args: [false],
      },
      {
        chainId,
        address: glpTokenAddress,
        abi: AMMCompounderBase,
        functionName: "totalSupply",
      },
    ],
    enabled: isArbitrumFamily && enabled,
  })
  const price = Number(formatUnits(queries.data?.[0].result ?? 0n, 30))
  const aumInUsdg = Number(formatUnits(queries.data?.[1].result ?? 0n, 18))
  const totalSupply = Number(formatUnits(queries.data?.[2].result ?? 0n, 18))

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null

    if (enabled) {
      intervalId = setInterval(() => {
        queries.refetch()
      }, 20000)
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [enabled, queries])

  return {
    aumInUsdg,
    price,
    totalSupply,
  }
}
