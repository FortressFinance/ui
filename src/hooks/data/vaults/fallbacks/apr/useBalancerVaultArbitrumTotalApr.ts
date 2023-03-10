import { VaultDynamicProps } from "@/lib/types"

export default function useBalancerVaultArbitrumTotalApr({
  asset,
  enabled,
}: {
  asset: VaultDynamicProps["asset"]
  enabled: boolean
}) {
  // HARDCODED AS WE DONT HAVE ANY BALANCER IN ARBI AT THE MOMENT
  return {
    isLoading: false,
    data: 0,
  }
}
