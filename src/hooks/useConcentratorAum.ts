import { Address } from "wagmi"

import useConcentratorAumFallback from "@/hooks/lib/tvl/concentrator/useConcentratorAumFallback"

export function useConcentratorAum({
  asset,
  ybTokenAddress,
}: {
  asset: Address
  ybTokenAddress: Address
}) {
  return useConcentratorAumFallback({ asset, ybTokenAddress })
}
