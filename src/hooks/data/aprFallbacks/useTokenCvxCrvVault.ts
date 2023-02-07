import { useQuery } from "wagmi"

import { getFortCvxCrvAprFallback } from "@/lib/aprFallback"
import { VaultDynamicProps } from "@/hooks/types"
import useActiveChainId from "@/hooks/useActiveChainId"

export default function useTokenCvxCrvVault({ asset, enabled }: { asset: VaultDynamicProps["asset"], enabled: boolean }) {
  const chainId = useActiveChainId()
  const fortCvxCrvAprFallback = useQuery([chainId, asset, "fortCvxCrvAprFallback"], {
    queryFn: () => getFortCvxCrvAprFallback(),
    retry: false,
    enabled: enabled,
  })

  return fortCvxCrvAprFallback
}