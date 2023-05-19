import { Address, useContractRead } from "wagmi"

import { useConcentratorContract } from "@/hooks/lib/useConcentratorContract"

// TODO: This is not used anywhere. Should it be deleted?

export const useConcentratorAsset = ({
  ybToken,
  share,
  enabled,
}: {
  ybToken: Address
  share: bigint
  enabled: boolean
}) =>
  useContractRead({
    ...useConcentratorContract(ybToken),
    functionName: "convertToAssets",
    args: [share],
    enabled: enabled,
  })
