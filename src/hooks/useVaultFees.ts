import { formatUnits } from "ethers/lib/utils.js"

import {
  findApiCompounderVaultForAsset,
  findApiTokenVaultForAsset,
} from "@/lib/findApiVaultForAsset"
import { VaultProps } from "@/lib/types"
import { useApiCompounderVaults } from "@/hooks/lib/api/useApiCompounderVaults"
import { useApiTokenVaults } from "@/hooks/lib/api/useApiTokenVaults"
import { useFallbackRead } from "@/hooks/lib/useFallbackRequest"
import { useVaultContract } from "@/hooks/lib/useVaultContract"

// TODO: Implement full fees support
const HARDCODED_FEES = { depositFee: "0", managementFee: "0" }

export function useVaultFees({ asset, type, vaultAddress }: VaultProps) {
  // Preferred: API request
  const apiCompounderFees = useApiCompounderVaultFees({ asset, type })
  const apiTokenCompounderFees = useApiTokenCompounderVaultFees({ asset, type })

  // Fallback: amm contract request
  const vaultContract = useVaultContract(vaultAddress)
  const fallbackRequest = useFallbackRead(
    {
      ...vaultContract,
      enabled: !!asset,
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
    },
    [apiCompounderFees, apiTokenCompounderFees]
  )

  return apiCompounderFees.isEnabled && !apiCompounderFees.isError
    ? apiCompounderFees
    : apiTokenCompounderFees.isEnabled && !apiTokenCompounderFees.isError
    ? apiTokenCompounderFees
    : fallbackRequest
}

function useApiCompounderVaultFees({
  asset,
  type,
}: Pick<VaultProps, "asset" | "type">) {
  const apiCompounderVault = useApiCompounderVaults({ type })
  const matchedVault = findApiCompounderVaultForAsset(
    apiCompounderVault.data,
    asset
  )
  return {
    ...apiCompounderVault,
    data: {
      ...HARDCODED_FEES,
      platformFee: matchedVault?.platformFee
        ? String(matchedVault.platformFee)
        : undefined,
      withdrawFee: matchedVault?.withdrawalFee
        ? String(matchedVault.withdrawalFee)
        : undefined,
    },
  }
}

function useApiTokenCompounderVaultFees({
  asset,
  type,
}: Pick<VaultProps, "asset" | "type">) {
  const apiTokenVault = useApiTokenVaults({ type })
  const matchedVault = findApiTokenVaultForAsset(apiTokenVault.data, asset)
  return {
    ...apiTokenVault,
    data: {
      ...HARDCODED_FEES,
      platformFee: matchedVault?.platformFee
        ? String(matchedVault.platformFee)
        : undefined,
      withdrawFee: matchedVault?.withdrawalFee
        ? String(matchedVault.withdrawalFee)
        : undefined,
    },
  }
}
