import { BigNumber } from "ethers"
import { Address, useContractRead } from "wagmi"

import { useConcentratorContract } from "@/hooks/lib/useConcentratorContract"

export default function useConcentratorAsset({
  ybTokenAddress,
  share,
  enabled,
}: {
  ybTokenAddress: Address
  share: BigNumber
  enabled: boolean
}) {
  const concentratorContract = useConcentratorContract(ybTokenAddress)

  const assetQuery = useContractRead({
    ...concentratorContract,
    functionName: "convertToAssets",
    args: [share],
    enabled: enabled,
  })

  return assetQuery
}
