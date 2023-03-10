import { useContractRead } from "wagmi"

import { VaultDynamicProps } from "@/lib/types"
import { useVaultContract } from "@/hooks/contracts/useVaultContract"

// work also for the token compounder

export default function useVaultTotalAssets({
  vaultAddress,
  enabled,
}: {
  vaultAddress: VaultDynamicProps["vaultAddress"]
  enabled: boolean
}) {
  const vaultContract = useVaultContract(vaultAddress)

  const totalAssetsQuery = useContractRead({
    ...vaultContract,
    functionName: "totalAssets",
    enabled: enabled,
  })

  return totalAssetsQuery
}
