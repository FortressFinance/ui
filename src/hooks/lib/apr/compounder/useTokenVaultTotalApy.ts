import { Address } from "wagmi"

import { convertToApy } from "@/lib/api/vaults/convertToApy"
import { VaultDynamicProps } from "@/lib/types"
import { useActiveChainId } from "@/hooks"
import useTokenVaultArbitrumTotalApr from "@/hooks/lib/apr/compounder/useTokenVaultArbitrumTotalApr"
import useTokenVaultMainnetTotalApr from "@/hooks/lib/apr/compounder/useTokenVaultMainnetTotalApr"

export default function useTokenVaultTotalApy({
  asset,
  enabled,
}: {
  asset: Address
  enabled: boolean
}) {
  const apr = useTokenVaultTotalApr({ asset, enabled })
  return {
    ...apr,
    data: convertToApy(apr.data),
  }
}

export function useTokenVaultTotalApr({
  asset,
  enabled,
}: Pick<VaultDynamicProps, "asset"> & {
  enabled: boolean
}) {
  const chainId = useActiveChainId()
  const isArbitrumFamily =
    chainId === 313371 || chainId === 42161 || chainId === 1337
  const tokenVaultMainnetTotalApr = useTokenVaultMainnetTotalApr({
    asset,
    enabled: enabled && !isArbitrumFamily,
  })

  const tokenVaultArbitrumTotalApr = useTokenVaultArbitrumTotalApr({
    asset,
    enabled: enabled && isArbitrumFamily,
  })

  if (!isArbitrumFamily) {
    return tokenVaultMainnetTotalApr
  }
  return tokenVaultArbitrumTotalApr
}
