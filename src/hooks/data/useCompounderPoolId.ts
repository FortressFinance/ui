import useApiCompounderPools from "@/hooks/api/useApiCompounderPools"
import { VaultProps } from "@/hooks/types"
import useIsTokenCompounder from "@/hooks/useIsTokenCompounder"

export default function useCompounderPoolId({ address, type }: VaultProps) {
  const isToken = useIsTokenCompounder(type)

  const apiQuery = useApiCompounderPools({ type })
  return {
    ...apiQuery,
    data: isToken
      ? apiQuery.data?.find((p) => p.token.ybToken.address === address)?.vaultId
      : apiQuery.data?.find((p) => p.token.ybToken.address === address)?.poolId,
  }
}
