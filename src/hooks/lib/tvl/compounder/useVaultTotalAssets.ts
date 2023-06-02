import { useContractRead } from "wagmi"

import { VaultDynamicProps } from "@/lib/types"
import { useVaultContract } from "@/hooks/lib/useVaultContract"

// work also for the token compounder

const useVaultTotalAssets = ({
  vaultAddress,
  enabled = true,
}: Pick<VaultDynamicProps, "vaultAddress"> & {
  enabled?: boolean
}) =>
  useContractRead({
    ...useVaultContract(vaultAddress),
    functionName: "totalAssets",
    enabled: enabled,
  })

export default useVaultTotalAssets
