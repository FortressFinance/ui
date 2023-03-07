import { VaultDynamicProps } from "@/lib/types"
import { useApiVaultDynamic } from "@/hooks/api"
import useBalancerVaultMainnetTotalApr from "@/hooks/data/vaults/fallbacks/useBalancerVaultMainnetTotalApr"
import useBalancerVaultTotalApr from "@/hooks/data/vaults/fallbacks/useBalancerVaultTotalApr"
import useCurveVaultMainnetTotalApr from "@/hooks/data/vaults/fallbacks/useCurveVaultMainnetTotalApr"
import useCurveVaultTotalApr from "@/hooks/data/vaults/fallbacks/useCurveVaultTotalApr"
import useTokenAuraBalVault from "@/hooks/data/vaults/fallbacks/useTokenAuraBalVault"
import useTokenGlpVault from "@/hooks/data/vaults/fallbacks/useTokenGlpVault"
import useTokenVaultMainnetTotalApr from "@/hooks/data/vaults/fallbacks/useTokenVaultMainnetTotalApr"
import useTokenVaultSymbol from "@/hooks/data/vaults/fallbacks/useTokenVaultSymbol"
import useTokenVaultTotalApr from "@/hooks/data/vaults/fallbacks/useTokenVaultTotalApr"
import { useVaultAprFallback } from "@/hooks/data/vaults/fallbacks/useVaultAprFallback"
import {
  useIsCurveCompounder,
  useIsTokenCompounder,
} from "@/hooks/useVaultTypes"

export function useVaultApy({ asset, poolId, type }: VaultDynamicProps) {
  const isCurve = useIsCurveCompounder(type)
  const isToken = useIsTokenCompounder(type)
  // Preferred: API request
  const apiQuery = useApiVaultDynamic({ poolId, type })

  const isCurveFallbackEnabled = apiQuery.isError && isCurve && !isToken
  const isBalancerFallbackEnabled = apiQuery.isError && !isCurve && !isToken
  const isTokenFallbackEnabled = apiQuery.isError && isToken

  const curveVaultTotalApr = useCurveVaultTotalApr({
    asset,
    enabled: isCurveFallbackEnabled ?? false,
  })
  const balancerVaultTotalApr = useBalancerVaultTotalApr({
    asset,
    enabled: isBalancerFallbackEnabled ?? false,
  })
  const tokenVaultTotalApr = useTokenVaultTotalApr({
    asset,
    enabled: isTokenFallbackEnabled ?? false,
  })

  if (isCurveFallbackEnabled) {
    return {
      ...curveVaultTotalApr,
      isLoading: curveVaultTotalApr?.isLoading ?? true,
      data: curveVaultTotalApr?.data,
    }
  }

  if (isBalancerFallbackEnabled) {
    return balancerVaultTotalApr
  }

  if (isTokenFallbackEnabled) {
    return tokenVaultTotalApr
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

  const curveVaultGraphTotalApr = useCurveVaultMainnetTotalApr({
    asset,
    enabled: isCurveFallbackEnabled ?? false,
  })
  const balancerVaultGraphTotalApr = useBalancerVaultMainnetTotalApr({
    asset,
    enabled: isBalancerFallbackEnabled ?? false,
  })
  const tokenVaultGraphTotalApr = useTokenVaultMainnetTotalApr({
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
