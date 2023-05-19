import { formatUnits } from "viem"
import { Address, useContractRead } from "wagmi"

import { ConcentratorStaticData } from "@/lib/api/concentrators"
import { VaultProps } from "@/lib/types"
import { useApiConcentratorStaticData } from "@/hooks/lib/api/useApiConcentratorStaticData"
import { useVaultContract } from "@/hooks/lib/useVaultContract"
import { useVaultYbtokenAddress } from "@/hooks/useVaultYbtokenAddress"

// TODO: Implement full fees support
const HARDCODED_FEES = { depositFee: "0", managementFee: "0" }

export function useConcentratorVaultFees({ asset, vaultAddress }: VaultProps) {
  const apiConcentratorStaticData = useApiConcentratorStaticData()
  const matchedVault = findApiConcentratorForPrimaryAsset(
    apiConcentratorStaticData.data,
    vaultAddress
  )

  const ybTokenAddress = useVaultYbtokenAddress({
    asset,
    vaultAddress,
    productType: "concentrator",
  })
  const vaultContract = useVaultContract(ybTokenAddress)
  const fallbackRequest = useContractRead({
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
  })

  return apiConcentratorStaticData.isError
    ? fallbackRequest
    : {
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
  return data?.find((v) => v.concentrator.primaryAsset.address === primaryAsset)
}
