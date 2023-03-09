import { useContractRead } from "wagmi"

import { VaultDynamicProps } from "@/lib/types"
import useActiveChainId from "@/hooks/useActiveChainId"

import { vaultCompounderAbi, vaultCompounderArbitrumAbi } from "@/constant/abi"

export default function useCurveVaultTotalAssets({
  vaultAddress,
  enabled,
}: {
  vaultAddress: VaultDynamicProps["vaultAddress"]
  enabled: boolean
}) {
  const chainId = useActiveChainId()
  const isArbitrumFamily = chainId === 313371 || chainId === 42161

  const totalAssetsArbitrumQuery = useContractRead({
    chainId,
    abi: vaultCompounderArbitrumAbi,
    address: vaultAddress,
    functionName: "totalAssets",
    enabled: isArbitrumFamily && enabled,
  })

  const totalAssetsQuery = useContractRead({
    chainId,
    abi: vaultCompounderAbi,
    address: vaultAddress,
    functionName: "totalAssets",
    enabled: !isArbitrumFamily && enabled,
  })

  return isArbitrumFamily ? totalAssetsArbitrumQuery : totalAssetsQuery
}
