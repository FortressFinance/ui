import { Address } from "wagmi"

import useConcentratorAumFallback from "@/hooks/lib/tvl/concentrator/useConcentratorAumFallback"

type ConcentratorAumProps = {
  targetAsset: Address
}

export function useConcentratorAum({ targetAsset }: ConcentratorAumProps) {
  const aumFallback = useConcentratorAumFallback({
    targetAsset,
    enabled: true,
  })

  return aumFallback
}
