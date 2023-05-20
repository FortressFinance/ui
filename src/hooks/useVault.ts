import { Address, useContractReads } from "wagmi"

import { useVaultContract } from "@/hooks/lib/useVaultContract"

export function useVault({
  asset,
  vaultAddress,
}: {
  asset: Address
  vaultAddress: Address
}) {
  const vaultContract = useVaultContract(vaultAddress)
  return useContractReads({
    contracts: [
      { ...vaultContract, functionName: "name" },
      { ...vaultContract, functionName: "symbol" },
      { ...vaultContract, functionName: "decimals" },
      { ...vaultContract, functionName: "getUnderlyingAssets" },
    ],
    enabled: !!asset && !!vaultAddress,
    select: ([name, symbol, decimals, underlyingAssets]) => ({
      name: name.result,
      symbol: symbol.result,
      decimals: decimals.result,
      underlyingAssets: underlyingAssets.result,
    }),
  })
}
