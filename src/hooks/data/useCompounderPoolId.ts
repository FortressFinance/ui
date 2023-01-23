import useApiCompounderPools from "@/hooks/api/useApiCompounderPools"
import { VaultProps } from "@/hooks/types"

export default function useCompounderPoolId({ address, type }: VaultProps) {
  const apiQuery = useApiCompounderPools({ type })
  return {
    ...apiQuery,
    data: apiQuery.data?.find((p) => p.token.ybToken.address === address)
      ?.poolId,
  }
}
