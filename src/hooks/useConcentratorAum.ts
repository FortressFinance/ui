import { Address } from "wagmi"

import useConcentratorAumFallback from "@/hooks/lib/tvl/concentrator/useConcentratorAumFallback"

type ConcentratorAumProps = {
  targetAsset: Address
  ybToken: Address
}

export function useConcentratorAum({
  targetAsset,
  ybToken,
}: ConcentratorAumProps) {
  const aumFallback = useConcentratorAumFallback({
    targetAsset,
    ybToken,
    enabled: true,
  })

  return aumFallback
}
