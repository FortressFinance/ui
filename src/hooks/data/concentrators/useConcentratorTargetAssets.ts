import { ConcentratorTargetAsset } from "@/lib/types"

// ! Mocked hook for use with new registry interface

export function useConcentratorTargetAssets(options: {
  onSuccess?: (data: ConcentratorTargetAsset[]) => void
}) {
  const data: ConcentratorTargetAsset[] = ["auraBAL", "ETH", "cvxCRV"]
  options?.onSuccess?.(data)
  return {
    data,
    isLoading: false,
    isFetching: false,
  }
}
