import { VaultDynamicProps } from "@/lib/types"
import { useApiVaultDynamic } from "@/hooks/api"
import useBalancerVaultGraphTotalApr from "@/hooks/data/aprFallbacks/useBalancerVaultGraphTotalApr"
import useCurveVaultGraphTotalApr from "@/hooks/data/aprFallbacks/useCurveVaultGraphTotalApr"
import useTokenAuraBalVault from "@/hooks/data/aprFallbacks/useTokenAuraBalVault"
import useTokenGlpVault from "@/hooks/data/aprFallbacks/useTokenGlpVault"
import useTokenVaultGraphTotalApr from "@/hooks/data/aprFallbacks/useTokenVaultGraphTotalApr"
import useTokenVaultSymbol from "@/hooks/data/aprFallbacks/useTokenVaultSymbol"
import { useVaultAprFallback } from "@/hooks/data/aprFallbacks/useVaultAprFallback"
import {
  useIsCurveCompounder,
  useIsTokenCompounder,
} from "@/hooks/useVaultTypes"

export default function useVaultApy({
  asset,
  poolId,
  type,
}: VaultDynamicProps) {
  const isCurve = useIsCurveCompounder(type)
  const isToken = useIsTokenCompounder(type)
  // Preferred: API request
  const apiQuery = useApiVaultDynamic({ poolId, type })

  const isCurveFallbackEnabled = apiQuery.isError && isCurve && !isToken
  const isBalancerFallbackEnabled = apiQuery.isError && !isCurve && !isToken
  const isTokenFallbackEnabled = apiQuery.isError && isToken

  const curveVaultGraphTotalApr = useCurveVaultGraphTotalApr({
    asset,
    enabled: isCurveFallbackEnabled ?? false,
  })
  const balancerVaultGraphTotalApr = useBalancerVaultGraphTotalApr({
    asset,
    enabled: isBalancerFallbackEnabled ?? false,
  })
  const tokenVaultGraphTotalApr = useTokenVaultGraphTotalApr({
    asset,
    enabled: isTokenFallbackEnabled ?? false,
  })
  const compoundPeriod = 84_600 // 1 day
  const yearInSecond = 31_556_926
  const n = yearInSecond / compoundPeriod

  if (isCurveFallbackEnabled) {
    const totalApr = curveVaultGraphTotalApr.data ?? 0
    const apy = (1 + totalApr / n) ** n - 1
    return {
      ...curveVaultGraphTotalApr,
      data: apy,
    }
  }

  if (isBalancerFallbackEnabled) {
    const totalApr = balancerVaultGraphTotalApr.data ?? 0
    const apy = (1 + totalApr / n) ** n - 1
    return {
      ...balancerVaultGraphTotalApr,
      data: apy,
    }
  }

  if (isTokenFallbackEnabled) {
    const totalApr = tokenVaultGraphTotalApr.data ?? 0
    const apy = (1 + totalApr / n) ** n - 1
    return {
      ...tokenVaultGraphTotalApr,
      data: apy,
    }
  }

  return {
    ...apiQuery,
    data: apiQuery.data?.APY,
  }
}

export function useVaultBaseApr({ asset, poolId, type }: VaultDynamicProps) {
  // Preferred: API request
  const apiQuery = useApiVaultDynamic({ poolId, type })

  const vaultAprFallback = useVaultAprFallback({
    asset,
    enabled: apiQuery.isError,
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

export function useVaultCrvApr({ asset, poolId, type }: VaultDynamicProps) {
  // Preferred: API request
  const apiQuery = useApiVaultDynamic({ poolId, type })

  const vaultAprFallback = useVaultAprFallback({
    asset,
    enabled: apiQuery.isError,
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

export function useVaultCvxApr({ asset, poolId, type }: VaultDynamicProps) {
  // Preferred: API request
  const apiQuery = useApiVaultDynamic({ poolId, type })

  const vaultAprFallback = useVaultAprFallback({
    asset,
    enabled: apiQuery.isError,
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

export function useVaultExtraApr({ asset, poolId, type }: VaultDynamicProps) {
  // Preferred: API request
  const apiQuery = useApiVaultDynamic({ poolId, type })

  const vaultAprFallback = useVaultAprFallback({
    asset,
    enabled: apiQuery.isError,
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

export function useVaultTotalApr({ asset, poolId, type }: VaultDynamicProps) {
  const isCurve = useIsCurveCompounder(type)
  const isToken = useIsTokenCompounder(type)
  // Preferred: API request
  const apiQuery = useApiVaultDynamic({ poolId, type })

  const isCurveFallbackEnabled = apiQuery.isError && isCurve && !isToken
  const isBalancerFallbackEnabled = apiQuery.isError && !isCurve && !isToken
  const isTokenFallbackEnabled = apiQuery.isError && isToken

  const curveVaultGraphTotalApr = useCurveVaultGraphTotalApr({
    asset,
    enabled: isCurveFallbackEnabled ?? false,
  })
  const balancerVaultGraphTotalApr = useBalancerVaultGraphTotalApr({
    asset,
    enabled: isBalancerFallbackEnabled ?? false,
  })
  const tokenVaultGraphTotalApr = useTokenVaultGraphTotalApr({
    asset,
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

export function useVaultBalApr({ asset, poolId, type }: VaultDynamicProps) {
  const isToken = useIsTokenCompounder(type)
  // Preferred: API request
  const apiQuery = useApiVaultDynamic({ poolId, type })

  const isTokenFallbackEnabled = apiQuery.isError && isToken
  const tokenVaultSymbol = useTokenVaultSymbol({
    asset,
    enabled: isTokenFallbackEnabled ?? false,
  })

  const ybTokenSymbol = tokenVaultSymbol.data

  const isAuraTokenFallbackEnabled =
    isTokenFallbackEnabled &&
    !!ybTokenSymbol &&
    ybTokenSymbol === "fort-auraBAL"
  const tokenAuraBalVault = useTokenAuraBalVault({
    asset,
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

export function useVaultAuraApr({ asset, poolId, type }: VaultDynamicProps) {
  const isToken = useIsTokenCompounder(type)
  // Preferred: API request
  const apiQuery = useApiVaultDynamic({ poolId, type })

  const isTokenFallbackEnabled = apiQuery.isError && isToken
  const tokenVaultSymbol = useTokenVaultSymbol({
    asset,
    enabled: isTokenFallbackEnabled ?? false,
  })

  const ybTokenSymbol = tokenVaultSymbol.data

  const isAuraTokenFallbackEnabled =
    isTokenFallbackEnabled &&
    !!ybTokenSymbol &&
    ybTokenSymbol === "fort-auraBAL"
  const tokenAuraBalVault = useTokenAuraBalVault({
    asset,
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

export function useVaultGmxApr({ asset, poolId, type }: VaultDynamicProps) {
  const isToken = useIsTokenCompounder(type)
  // Preferred: API request
  const apiQuery = useApiVaultDynamic({ poolId, type })

  const isTokenFallbackEnabled = apiQuery.isError && isToken
  const tokenVaultSymbol = useTokenVaultSymbol({
    asset,
    enabled: isTokenFallbackEnabled ?? false,
  })

  const ybTokenSymbol = tokenVaultSymbol.data

  const isGlpTokenFallbackEnabled =
    isTokenFallbackEnabled && !!ybTokenSymbol && ybTokenSymbol === "fortGLP"
  const tokenGlpVault = useTokenGlpVault({
    asset,
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

export function useVaultEthApr({ asset, poolId, type }: VaultDynamicProps) {
  const isToken = useIsTokenCompounder(type)
  // Preferred: API request
  const apiQuery = useApiVaultDynamic({ poolId, type })

  const isTokenFallbackEnabled = apiQuery.isError && isToken
  const tokenVaultSymbol = useTokenVaultSymbol({
    asset,
    enabled: isTokenFallbackEnabled ?? false,
  })

  const ybTokenSymbol = tokenVaultSymbol.data

  const isGlpTokenFallbackEnabled =
    isTokenFallbackEnabled && !!ybTokenSymbol && ybTokenSymbol === "fortGLP"
  const tokenGlpVault = useTokenGlpVault({
    asset,
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
