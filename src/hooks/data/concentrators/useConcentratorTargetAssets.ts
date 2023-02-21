import { TargetAsset } from "@/lib/types"

// ! Mocked hook for use with new registry interface

export function useConcentratorTargetAssets(options: {
  onSuccess?: (data: TargetAsset[]) => void
}) {
  const data: TargetAsset[] = ["auraBAL", "ETH", "cvxCRV"]
  options?.onSuccess?.(data)
  return {
    data,
    isLoading: false,
    isFetching: false,
  }
}
