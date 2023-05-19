import { Address } from "wagmi"

import { useFallbackReads } from "@/hooks/lib/useFallbackRequest"
import { useVaultContract } from "@/hooks/lib/useVaultContract"

export function useVault({
  asset,
  vaultAddress,
}: {
  asset: Address
  vaultAddress: Address
}) {
  const vaultContract = useVaultContract(vaultAddress)
  return useFallbackReads(
    {
      contracts: [
        { ...vaultContract, functionName: "name" },
        { ...vaultContract, functionName: "symbol" },
        { ...vaultContract, functionName: "decimals" },
        { ...vaultContract, functionName: "getUnderlyingAssets" },
      ],
      enabled: !!asset && !!vaultAddress,
      select: (data) => ({
        name: data[0],
        symbol: data[1],
        decimals: data[2],
        underlyingAssets: data[3],
      }),
    },
    []
  )
}
