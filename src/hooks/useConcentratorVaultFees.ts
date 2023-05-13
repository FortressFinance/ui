import { formatUnits } from "ethers/lib/utils.js"
import { Address } from "wagmi"

import { ConcentratorStaticData } from "@/lib/api/concentrators"
import { VaultProps } from "@/lib/types"
import { useConcentratorVaultYbtokenAddress } from "@/hooks"
import { useApiConcentratorStaticData } from "@/hooks/lib/api/useApiConcentratorStaticData"
import { useFallbackRead } from "@/hooks/lib/useFallbackRequest"
import { useVaultContract } from "@/hooks/lib/useVaultContract"

// TODO: Implement full fees support
const HARDCODED_FEES = { depositFee: "0", managementFee: "0" }

export function useConcentratorVaultFees({ asset, vaultAddress }: VaultProps) {
  const apiConcentratorStaticData = useApiConcentratorStaticData()
  const matchedVault = findApiConcentratorForPrimaryAsset(
    apiConcentratorStaticData.data,
    vaultAddress
  )

  const ybTokenAddress = useConcentratorVaultYbtokenAddress({
    targetAsset: asset,
    primaryAsset: vaultAddress,
  })
  const vaultContract = useVaultContract(ybTokenAddress)
  const fallbackRequest = useFallbackRead(
    {
      ...vaultContract,
      enabled: apiConcentratorStaticData.isError,
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
    []
  )

  if (apiConcentratorStaticData.isError) {
    return fallbackRequest
  }

  return {
    ...apiConcentratorStaticData,
    data: {
      ...HARDCODED_FEES,
      platformFee: matchedVault?.concentrator?.platformFee,
      withdrawFee: matchedVault?.concentrator?.withdrawalFee,
    },
  }
}

function findApiConcentratorForPrimaryAsset(
  data: ConcentratorStaticData[] | undefined,
  primaryAsset: Address | undefined
) {
  return data?.find(
    (v) => v.concentrator?.primaryAsset?.address === primaryAsset
  )
}
