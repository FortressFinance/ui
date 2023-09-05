import { formatUnits } from "viem"
import { useContractRead } from "wagmi"

import { VaultProps } from "@/lib/types"
import { useVaultContract } from "@/hooks/lib/useVaultContract"

// TODO: Implement full fees support
const HARDCODED_FEES = { depositFee: "0", managementFee: "0" }

export function useCompounderVaultFees({
  asset,
  vaultAddress,
  enabled,
}: Pick<VaultProps, "asset" | "type" | "vaultAddress"> & {
  enabled: boolean
}) {
  return useContractRead({
    ...useVaultContract(vaultAddress),
    enabled: !!asset && enabled,
    functionName: "fees",
    select: ([
      platformFeePercentage,
      _harvestBountyPercentage,
      withdrawFeePercentage,
    ]) => ({
      ...HARDCODED_FEES,
      platformFee: formatUnits(platformFeePercentage, 9),
      withdrawFee: formatUnits(withdrawFeePercentage, 9),
    }),
  })
}
