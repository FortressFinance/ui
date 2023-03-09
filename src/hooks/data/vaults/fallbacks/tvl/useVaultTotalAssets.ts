import { useContractRead } from "wagmi"

import { VaultDynamicProps } from "@/lib/types"
import useActiveChainId from "@/hooks/useActiveChainId"

// work also for the token compounder
import { AMMCompounderBase } from "@/constant/abi"

export default function useVaultTotalAssets({
  vaultAddress,
  enabled,
}: {
  vaultAddress: VaultDynamicProps["vaultAddress"]
  enabled: boolean
}) {
  const chainId = useActiveChainId()

  const totalAssetsQuery = useContractRead({
    chainId,
    abi: AMMCompounderBase,
    address: vaultAddress,
    functionName: "totalAssets",
    enabled: enabled,
  })

  return totalAssetsQuery
}
