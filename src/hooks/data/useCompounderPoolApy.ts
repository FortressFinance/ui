import { useApiCompounderPoolDynamic } from "@/hooks/api"
import { VaultDynamicProps } from "@/hooks/types"

export default function useCompounderPoolApy({
  asset: _address,
  poolId,
  type,
}: VaultDynamicProps) {
  // Preferred: API request
  const apiQuery = useApiCompounderPoolDynamic({ poolId, type })
  // TODO: Fallbacks?
  return {
    ...apiQuery,
    data: apiQuery.data?.APY,
  }
}

export function useCompounderPoolBaseApr({
  asset: _address,
  poolId,
  type,
}: VaultDynamicProps) {
  // Preferred: API request
  const apiQuery = useApiCompounderPoolDynamic({ poolId, type })
  // TODO: Fallbacks?
  return {
    ...apiQuery,
    data: apiQuery.data?.APR?.baseApr,
  }
}

export function useCompounderPoolCrvApr({
  asset: _address,
  poolId,
  type,
}: VaultDynamicProps) {
  // Preferred: API request
  const apiQuery = useApiCompounderPoolDynamic({ poolId, type })
  // TODO: Fallbacks?
  return {
    ...apiQuery,
    data: apiQuery.data?.APR?.crvApr,
  }
}

export function useCompounderPoolCvxApr({
  asset: _address,
  poolId,
  type,
}: VaultDynamicProps) {
  // Preferred: API request
  const apiQuery = useApiCompounderPoolDynamic({ poolId, type })
  // TODO: Fallbacks?
  return {
    ...apiQuery,
    data: apiQuery.data?.APR?.cvxApr,
  }
}

export function useCompounderPoolExraApr({
  asset: _address,
  poolId,
  type,
}: VaultDynamicProps) {
  // Preferred: API request
  const apiQuery = useApiCompounderPoolDynamic({ poolId, type })
  // TODO: Fallbacks?
  return {
    ...apiQuery,
    data: apiQuery.data?.APR?.extraRewardsApr,
  }
}

export function useCompounderPoolTotalApr({
  asset: _address,
  poolId,
  type,
}: VaultDynamicProps) {
  // Preferred: API request
  const apiQuery = useApiCompounderPoolDynamic({ poolId, type })
  // TODO: Fallbacks?
  return {
    ...apiQuery,
    data: apiQuery.data?.APR?.totalApr,
  }
}
