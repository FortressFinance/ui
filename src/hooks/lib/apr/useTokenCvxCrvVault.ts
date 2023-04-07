import { useQuery } from "@tanstack/react-query"

import { getFortCvxCrvAprFallback } from "@/lib/api/vaults"
import { useActiveChainId } from "@/hooks"

export default function useTokenCvxCrvVault({
  asset,
  enabled,
}: {
  asset: Address
  enabled: boolean
}) {
  const chainId = useActiveChainId()
  const fortCvxCrvAprFallback = useQuery(
    [chainId, asset, "fortCvxCrvAprFallback"],
    {
      queryFn: () => getFortCvxCrvAprFallback(),
      retry: false,
      enabled: enabled,
    }
  )

  return fortCvxCrvAprFallback
}
