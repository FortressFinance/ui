import { Address } from "wagmi"

export default function useBalancerVaultArbitrumTotalApr({
  asset: _asset,
  enabled: _enabled,
}: {
  asset: Address
  enabled: boolean
}) {
  // HARDCODED AS WE DONT HAVE ANY BALANCER IN ARBI AT THE MOMENT
  return {
    isLoading: false,
    data: 0,
  }
}
