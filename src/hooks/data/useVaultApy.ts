import { useApiCompounderPoolDynamic } from "@/hooks/api"
import { VaultDynamicProps } from "@/hooks/types"

export default function useVaultApy({ poolId, type }: VaultDynamicProps) {
  // Preferred: API request
  const apiQuery = useApiCompounderPoolDynamic({ poolId, type })
  // TODO: Fallbacks?
  return {
    ...apiQuery,
    data: apiQuery.data?.APY,
  }
}

export function useVaultBaseApr({ poolId, type }: VaultDynamicProps) {
  // Preferred: API request
  const apiQuery = useApiCompounderPoolDynamic({ poolId, type })
  // TODO: Fallbacks?
  return {
    ...apiQuery,
    data: apiQuery.data?.APR?.baseApr,
  }
}

export function useVaultCrvApr({ poolId, type }: VaultDynamicProps) {
  // Preferred: API request
  const apiQuery = useApiCompounderPoolDynamic({ poolId, type })
  // TODO: Fallbacks?
  return {
    ...apiQuery,
    data: apiQuery.data?.APR?.crvApr,
  }
}

export function useVaultCvxApr({ poolId, type }: VaultDynamicProps) {
  // Preferred: API request
  const apiQuery = useApiCompounderPoolDynamic({ poolId, type })
  // TODO: Fallbacks?
  return {
    ...apiQuery,
    data: apiQuery.data?.APR?.cvxApr,
  }
}

export function useVaultExraApr({ poolId, type }: VaultDynamicProps) {
  // Preferred: API request
  const apiQuery = useApiCompounderPoolDynamic({ poolId, type })
  // TODO: Fallbacks?
  return {
    ...apiQuery,
    data: apiQuery.data?.APR?.extraRewardsApr,
  }
}

export function useVaultTotalApr({ poolId, type }: VaultDynamicProps) {
  // Preferred: API request
  const apiQuery = useApiCompounderPoolDynamic({ poolId, type })
  // TODO: Fallbacks?
  return {
    ...apiQuery,
    data: apiQuery.data?.APR?.totalApr,
  }
}
