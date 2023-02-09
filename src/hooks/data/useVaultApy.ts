import { useQuery } from "wagmi"

import { getVaultAprFallback } from "@/lib/aprFallback"
import { VaultDynamicProps } from "@/lib/types"
import { useApiVaultDynamic } from "@/hooks/api"
import useBalancerVaultGraphTotalApr from "@/hooks/data/aprFallbacks/useBalancerVaultGraphTotalApr"
import useCurveVaultGraphTotalApr from "@/hooks/data/aprFallbacks/useCurveVaultGraphTotalApr"
import useTokenAuraBalVault from "@/hooks/data/aprFallbacks/useTokenAuraBalVault"
import useTokenGlpVault from "@/hooks/data/aprFallbacks/useTokenGlpVault"
import useTokenVaultGraphTotalApr from "@/hooks/data/aprFallbacks/useTokenVaultGraphTotalApr"
import useTokenVaultSymbol from "@/hooks/data/aprFallbacks/useTokenVaultSymbol"
import useIsCurve from "@/hooks/useIsCurve"
import useIsTokenCompounder from "@/hooks/useIsTokenCompounder"

export default function useVaultApy({
  asset: _address,
  poolId,
  type,
}: VaultDynamicProps) {
  // Preferred: API request
  const apiQuery = useApiVaultDynamic({ poolId, type })
  // TODO: Fallbacks?
  return {
    ...apiQuery,
    data: apiQuery.data?.APY,
  }
}

export function useVaultBaseApr({
  asset: _address,
  poolId,
  type,
}: VaultDynamicProps) {
  // Preferred: API request
  const apiQuery = useApiVaultDynamic({ poolId, type })

  const vaultAprFallback = useQuery([_address, "vaultAprFallback"], {
    queryFn: async () => await getVaultAprFallback(_address),
    retry: false,
    enabled: apiQuery.isError || apiQuery.data === null,
  })

  if (
    !vaultAprFallback.isError &&
    !!vaultAprFallback.data &&
    vaultAprFallback.data.length > 0
  ) {
    return {
      ...vaultAprFallback,
      data: vaultAprFallback.data?.[0].baseApr,
    }
  }

  return {
    ...apiQuery,
    data: apiQuery.data?.APR?.baseApr,
  }
}

export function useVaultCrvApr({
  asset: _address,
  poolId,
  type,
}: VaultDynamicProps) {
  // Preferred: API request
  const apiQuery = useApiVaultDynamic({ poolId, type })

  const vaultAprFallback = useQuery([_address, "vaultAprFallback"], {
    queryFn: async () => await getVaultAprFallback(_address),
    retry: false,
    enabled: apiQuery.isError || apiQuery.data === null,
  })

  if (
    !vaultAprFallback.isError &&
    !!vaultAprFallback.data &&
    vaultAprFallback.data.length > 0
  ) {
    return {
      ...vaultAprFallback,
      data: vaultAprFallback.data?.[0].crvApr,
    }
  }

  return {
    ...apiQuery,
    data: apiQuery.data?.APR?.crvApr,
  }
}

export function useVaultCvxApr({
  asset: _address,
  poolId,
  type,
}: VaultDynamicProps) {
  // Preferred: API request
  const apiQuery = useApiVaultDynamic({ poolId, type })

  const vaultAprFallback = useQuery([_address, "vaultAprFallback"], {
    queryFn: async () => await getVaultAprFallback(_address),
    retry: false,
    enabled: apiQuery.isError || apiQuery.data === null,
  })

  if (
    !vaultAprFallback.isError &&
    !!vaultAprFallback.data &&
    vaultAprFallback.data.length > 0
  ) {
    return {
      ...vaultAprFallback,
      data: vaultAprFallback.data?.[0].cvxApr,
    }
  }
  return {
    ...apiQuery,
    data: apiQuery.data?.APR?.cvxApr,
  }
}

export function useVaultExtraApr({
  asset: _address,
  poolId,
  type,
}: VaultDynamicProps) {
  // Preferred: API request
  const apiQuery = useApiVaultDynamic({ poolId, type })

  const vaultAprFallback = useQuery([_address, "vaultAprFallback"], {
    queryFn: async () => await getVaultAprFallback(_address),
    retry: false,
    enabled: apiQuery.isError || apiQuery.data === null,
  })

  if (
    !vaultAprFallback.isError &&
    !!vaultAprFallback.data &&
    vaultAprFallback.data.length > 0
  ) {
    return {
      ...vaultAprFallback,
      data: vaultAprFallback.data?.[0].extraRewardsApr,
    }
  }

  return {
    ...apiQuery,
    data: apiQuery.data?.APR?.extraRewardsApr,
  }
}

export function useVaultTotalApr({
  asset: _address,
  poolId,
  type,
}: VaultDynamicProps) {
  const isCurve = useIsCurve(type)
  const isToken = useIsTokenCompounder(type)
  // Preferred: API request
  const apiQuery = useApiVaultDynamic({ poolId, type })

  const isCurveFallbackEnabled =
    (apiQuery.isError || apiQuery.data === null) && isCurve && !isToken
  const isBalancerFallbackEnabled =
    (apiQuery.isError || apiQuery.data === null) && !isCurve && !isToken
  const isTokenFallbackEnabled =
    (apiQuery.isError || apiQuery.data === null) && isToken

  const curveVaultGraphTotalApr = useCurveVaultGraphTotalApr({
    asset: _address,
    enabled: isCurveFallbackEnabled ?? false,
  })
  const balancerVaultGraphTotalApr = useBalancerVaultGraphTotalApr({
    asset: _address,
    enabled: isBalancerFallbackEnabled ?? false,
  })
  const tokenVaultGraphTotalApr = useTokenVaultGraphTotalApr({
    asset: _address,
    enabled: isTokenFallbackEnabled ?? false,
  })

  if (isCurveFallbackEnabled) {
    return curveVaultGraphTotalApr
  }

  if (isBalancerFallbackEnabled) {
    return balancerVaultGraphTotalApr
  }

  if (isTokenFallbackEnabled) {
    return tokenVaultGraphTotalApr
  }

  return {
    ...apiQuery,
    data: apiQuery.data?.APR?.totalApr,
  }
}

export function useVaultBalApr({
  asset: _address,
  poolId,
  type,
}: VaultDynamicProps) {
  const isToken = useIsTokenCompounder(type)
  // Preferred: API request
  const apiQuery = useApiVaultDynamic({ poolId, type })

  const isTokenFallbackEnabled =
    (apiQuery.isError || apiQuery.data === null) && isToken
  const tokenVaultSymbol = useTokenVaultSymbol({
    asset: _address,
    enabled: isTokenFallbackEnabled ?? false,
  })

  const ybTokenSymbol = tokenVaultSymbol.data

  const isAuraTokenFallbackEnabled =
    isTokenFallbackEnabled &&
    !!ybTokenSymbol &&
    ybTokenSymbol === "fort-auraBAL"
  const tokenAuraBalVault = useTokenAuraBalVault({
    asset: _address,
    enabled: isAuraTokenFallbackEnabled ?? false,
  })

  if (!tokenAuraBalVault.isError && !!tokenAuraBalVault.data) {
    return {
      ...tokenAuraBalVault,
      data: tokenAuraBalVault.data.BALApr,
    }
  }

  return {
    ...apiQuery,
    data: apiQuery.data?.APR?.BALApr,
  }
}

export function useVaultAuraApr({
  asset: _address,
  poolId,
  type,
}: VaultDynamicProps) {
  const isToken = useIsTokenCompounder(type)
  // Preferred: API request
  const apiQuery = useApiVaultDynamic({ poolId, type })

  const isTokenFallbackEnabled =
    (apiQuery.isError || apiQuery.data === null) && isToken
  const tokenVaultSymbol = useTokenVaultSymbol({
    asset: _address,
    enabled: isTokenFallbackEnabled ?? false,
  })

  const ybTokenSymbol = tokenVaultSymbol.data

  const isAuraTokenFallbackEnabled =
    isTokenFallbackEnabled &&
    !!ybTokenSymbol &&
    ybTokenSymbol === "fort-auraBAL"
  const tokenAuraBalVault = useTokenAuraBalVault({
    asset: _address,
    enabled: isAuraTokenFallbackEnabled ?? false,
  })

  if (!tokenAuraBalVault.isError && !!tokenAuraBalVault.data) {
    return {
      ...tokenAuraBalVault,
      data: tokenAuraBalVault.data.AuraApr,
    }
  }
  return {
    ...apiQuery,
    data: apiQuery.data?.APR?.AuraApr,
  }
}

export function useVaultGmxApr({
  asset: _address,
  poolId,
  type,
}: VaultDynamicProps) {
  const isToken = useIsTokenCompounder(type)
  // Preferred: API request
  const apiQuery = useApiVaultDynamic({ poolId, type })

  const isTokenFallbackEnabled =
    (apiQuery.isError || apiQuery.data === null) && isToken
  const tokenVaultSymbol = useTokenVaultSymbol({
    asset: _address,
    enabled: isTokenFallbackEnabled ?? false,
  })

  const ybTokenSymbol = tokenVaultSymbol.data

  const isGlpTokenFallbackEnabled =
    isTokenFallbackEnabled && !!ybTokenSymbol && ybTokenSymbol === "fortGLP"
  const tokenGlpVault = useTokenGlpVault({
    asset: _address,
    enabled: isGlpTokenFallbackEnabled ?? false,
  })

  if (!tokenGlpVault.isError && !!tokenGlpVault.data) {
    return {
      ...tokenGlpVault,
      data: tokenGlpVault.data.GMXApr,
    }
  }

  return {
    ...apiQuery,
    data: apiQuery.data?.APR?.GMXApr,
  }
}

export function useVaultEthApr({
  asset: _address,
  poolId,
  type,
}: VaultDynamicProps) {
  const isToken = useIsTokenCompounder(type)
  // Preferred: API request
  const apiQuery = useApiVaultDynamic({ poolId, type })

  const isTokenFallbackEnabled =
    (apiQuery.isError || apiQuery.data === null) && isToken
  const tokenVaultSymbol = useTokenVaultSymbol({
    asset: _address,
    enabled: isTokenFallbackEnabled ?? false,
  })

  const ybTokenSymbol = tokenVaultSymbol.data

  const isGlpTokenFallbackEnabled =
    isTokenFallbackEnabled && !!ybTokenSymbol && ybTokenSymbol === "fortGLP"
  const tokenGlpVault = useTokenGlpVault({
    asset: _address,
    enabled: isGlpTokenFallbackEnabled ?? false,
  })

  if (!tokenGlpVault.isError && !!tokenGlpVault.data) {
    return {
      ...tokenGlpVault,
      data: tokenGlpVault.data.ETHApr,
    }
  }
  return {
    ...apiQuery,
    data: apiQuery.data?.APR?.ETHApr,
  }
}
