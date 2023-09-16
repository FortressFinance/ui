import { formatUnits } from "viem"
import { useContractRead } from "wagmi"

import { VaultProps } from "@/lib/types"
import { useConcentratorVaultYbtokenAddress } from "@/hooks"
import { useVaultContract } from "@/hooks/lib/useVaultContract"

// TODO: Implement full fees support
const HARDCODED_FEES = { depositFee: "0", managementFee: "0" }

export function useConcentratorVaultFees({
  asset,
  vaultAddress,
  enabled,
}: Pick<VaultProps, "asset" | "vaultAddress"> & {
  enabled: boolean
}) {
  const ybTokenAddress = useConcentratorVaultYbtokenAddress({
    targetAsset: asset,
    primaryAsset: vaultAddress,
    enabled,
  })
  const vaultContract = useVaultContract(ybTokenAddress ?? "0x")
  return useContractRead({
    ...vaultContract,
    enabled,
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
