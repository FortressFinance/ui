import { BigNumber } from "ethers"
import { Address, useContractRead } from "wagmi"

import { useConcentratorContract } from "@/hooks/lib/useConcentratorContract"

export default function useConcentratorAsset({
  ybToken,
  share,
  enabled,
}: {
  ybToken: Address
  share: BigNumber
  enabled: boolean
}) {
  const concentratorContract = useConcentratorContract(ybToken)

  const assetQuery = useContractRead({
    ...concentratorContract,
    functionName: "convertToAssets",
    args: [share],
    enabled: enabled,
  })

  return assetQuery
}
