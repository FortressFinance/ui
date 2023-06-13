import { Address, useContractRead } from "wagmi"

import { useConcentratorContract } from "@/hooks/lib/useConcentratorContract"

export default function useConcentratorTotalAssets({
  targetAsset,
  enabled,
}: {
  targetAsset: Address
  enabled?: boolean
}) {
  const vaultContract = useConcentratorContract(targetAsset)

  const totalAssetsQuery = useContractRead({
    ...vaultContract,
    functionName: "totalAssets",
    enabled: targetAsset !== "0x" && enabled,
  })

  return totalAssetsQuery
}
