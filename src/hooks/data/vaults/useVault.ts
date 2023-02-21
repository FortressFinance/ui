import { Address, useContractReads } from "wagmi"

import { VaultProps } from "@/lib/types"
import useActiveChainId from "@/hooks/useActiveChainId"

import { vaultCompounderAbi } from "@/constant/abi"

// TODO: Use API first

export function useVault({ asset, type, vaultAddress }: VaultProps) {
  const isToken = type === "token"
  const chainId = useActiveChainId()
  const contract = { chainId, address: vaultAddress, abi: vaultCompounderAbi }
  const vaultData = useContractReads({
    contracts: [
      { ...contract, functionName: "name" },
      { ...contract, functionName: "symbol" },
      { ...contract, functionName: "decimals" },
      { ...contract, functionName: "totalAssets" },
      { ...contract, functionName: isToken ? "name" : "getUnderlyingAssets" },
    ],
    enabled: !!vaultAddress,
  })

  const underlyingAssets = (
    isToken || !vaultData.data ? [asset] : vaultData.data[4]
  ) as Address[] | undefined

  return {
    ...vaultData,
    data: {
      name: vaultData.data?.[0],
      symbol: vaultData.data?.[1],
      decimals: vaultData.data?.[2],
      totalAssets: vaultData.data?.[3],
      underlyingAssets,
    },
  }
}

export type UseVaultResult = ReturnType<typeof useVault>["data"]
