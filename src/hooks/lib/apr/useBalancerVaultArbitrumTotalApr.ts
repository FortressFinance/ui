import { Address } from "wagmi"

export default function useBalancerVaultArbitrumTotalApr({
  asset,
  enabled,
}: {
  asset: Address
  enabled: boolean
}) {
  const balancerVaultBreakdownApr = useBalancerVaultArbitrumBreakdownApr({
    asset,
    enabled,
  })

  return {
    ...balancerVaultBreakdownApr,
    data: balancerVaultBreakdownApr.data.totalApr,
  }
}

export function useBalancerVaultArbitrumBreakdownApr({
  asset: _asset,
  enabled: _enabled,
}: {
  asset: Address
  enabled: boolean
}) {
  // HARDCODED AS WE DONT HAVE ANY BALANCER IN ARBI AT THE MOMENT
  return {
    isLoading: false,
    data: {
      totalApr: 0,
    },
  }
}
