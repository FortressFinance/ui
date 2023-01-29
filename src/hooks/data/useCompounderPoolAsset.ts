import { useContractRead } from "wagmi"

import useApiCompounderPools from "@/hooks/api/useApiCompounderPools"
import { VaultProps } from "@/hooks/types"

import curveCompounderAbi from "@/constant/abi/curveCompounderAbi"

export default function useCompounderPoolAsset({ address, type }: VaultProps) {
  // Preferred: API request
  const apiQuery = useApiCompounderPools({ type })
  // Fallback: contract request
  const contractQuery = useContractRead({
    abi: curveCompounderAbi,
    functionName: "asset",
    address,
  })
  // Prioritize API response until it has errored
  if (!apiQuery.isError && apiQuery.data !== null) {
    return {
      ...apiQuery,
      data: apiQuery.data?.find((p) => p.token.ybToken.address === address)
        ?.token.LPtoken.address,
    }
  }
  // Fallback to contract data after failure
  return contractQuery
}
