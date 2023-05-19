import { Address, useContractRead } from "wagmi"

import { VaultType } from "@/lib/types"
import { useRegistryContract } from "@/hooks/lib/useRegistryContract"

export const useCompounderVault = ({
  vaultAssetAddress,
  vaultType,
}: {
  vaultAssetAddress: Address
  vaultType: VaultType
}) =>
  useContractRead({
    ...useRegistryContract(),
    functionName:
      vaultType === "token"
        ? "getTokenCompounderVault"
        : "getAmmCompounderVault",
    args:
      vaultType === "token"
        ? [vaultAssetAddress]
        : [vaultType === "curve", vaultAssetAddress],
    select: (data) => ({ ybTokenAddress: data }),
  })
