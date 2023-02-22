import { formatUnits } from "ethers/lib/utils.js"

import {
  findApiCompounderVaultForAsset,
  findApiTokenVaultForAsset,
} from "@/lib/findApiVaultForAsset"
import { VaultProps } from "@/lib/types"
import { useApiCompounderVaults, useApiTokenVaults } from "@/hooks/api"
import useActiveChainId from "@/hooks/useActiveChainId"
import { useFallbackReads } from "@/hooks/util"

import { vaultCompounderAbi } from "@/constant/abi"

// TODO: Implement full fees support
const HARDCODED_FEES = { depositFee: "0", performanceFee: "0" }

export function useVaultFees({ asset, type, vaultAddress }: VaultProps) {
  const chainId = useActiveChainId()

  // Preferred: API request
  const apiCompounderFees = useApiCompounderVaultFees({ asset, type })
  const apiTokenCompounderFees = useApiTokenCompounderVaultFees({ asset, type })

  // Fallback: contract request
  const fallbackRequest = useFallbackReads(
    {
      contracts: [
        {
          chainId,
          abi: vaultCompounderAbi,
          address: vaultAddress,
          functionName: "platformFeePercentage",
        },
        {
          chainId,
          abi: vaultCompounderAbi,
          address: vaultAddress,
          functionName: "withdrawFeePercentage",
        },
      ],
      enabled: !!asset,
      select: (data) => ({
        ...HARDCODED_FEES,
        platformFee: formatUnits(data[0], 9),
        withdrawFee: formatUnits(data[1], 9),
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

function useApiCompounderVaultFees({ asset, type }: VaultProps) {
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

function useApiTokenCompounderVaultFees({ asset, type }: VaultProps) {
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
