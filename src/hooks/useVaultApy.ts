import { convertToApr } from "@/lib/api/vaults/convertToApy"
import { VaultProps } from "@/lib/types"
import useTokenVaultTotalApy, {
  useTokenVaultTotalApr,
} from "@/hooks/lib/apr/compounder/useTokenVaultTotalApy"
import useBalancerVaultTotalApy, {
  useBalancerVaultTotalApr,
} from "@/hooks/lib/apr/useBalancerVaultTotalApy"
import useCurveVaultBreakdownApr from "@/hooks/lib/apr/useCurveVaultBreakdownApr"
import useCurveVaultTotalApy, {
  useCurveVaultTotalApr,
} from "@/hooks/lib/apr/useCurveVaultTotalApy"
import useTokenAuraBalVault from "@/hooks/lib/apr/useTokenAuraBalVault"
import useTokenGlpVault from "@/hooks/lib/apr/useTokenGlpVault"
import { useTokenVaultSymbol } from "@/hooks/useTokenVaultSymbol"
import { useIsCurveVault, useIsTokenVault } from "@/hooks/useVaultTypes"

export function useVaultApy({ asset, type }: VaultProps) {
  const isCurve = useIsCurveVault(type)
  const isToken = useIsTokenVault(type)

  const isCurveFallbackEnabled = isCurve && !isToken
  const isBalancerFallbackEnabled = !isCurve && !isToken
  const isTokenFallbackEnabled = isToken

  const curveVaultTotalApy = useCurveVaultTotalApy({
    asset,
    enabled: isCurveFallbackEnabled ?? false,
  })
  const balancerVaultTotalApy = useBalancerVaultTotalApy({
    asset,
    enabled: isBalancerFallbackEnabled ?? false,
  })
  const tokenVaultTotalApy = useTokenVaultTotalApy({
    asset,
    enabled: isTokenFallbackEnabled ?? false,
  })

  if (isCurveFallbackEnabled) {
    return curveVaultTotalApy
  }

  if (isBalancerFallbackEnabled) {
    return balancerVaultTotalApy
  }

  return tokenVaultTotalApy
}

export function useVaultBaseApr({ asset }: VaultProps) {
  const vaultAprFallback = useCurveVaultBreakdownApr({
    asset,
    enabled: true,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = vaultAprFallback.data as any
  return {
    ...vaultAprFallback,
    data:
      data?.baseApy !== undefined ? convertToApr(data?.baseApy) : data?.baseApr,
  }
}

export function useTokenVaultCrvApr({ asset, type }: VaultProps) {
  const isToken = useIsTokenVault(type)

  const tokenVaultSymbol = useTokenVaultSymbol({
    asset,
    enabled: isToken ?? false,
  })

  const ybTokenSymbol = tokenVaultSymbol.data

  const isCrvTokenFallbackEnabled =
    isToken && !!ybTokenSymbol && ybTokenSymbol === "fort-cvxCRV"
  const vaultAprFallback = useCurveVaultBreakdownApr({
    asset,
    enabled: isCrvTokenFallbackEnabled ?? false,
  })

  if (!isCrvTokenFallbackEnabled) {
    return {
      isLoading: false,
      data: undefined,
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = vaultAprFallback.data as any

  return {
    ...vaultAprFallback,
    data:
      data?.crvApy !== undefined ? convertToApr(data?.crvApy) : data?.crvApr,
  }
}

export function useVaultCrvApr({ asset }: VaultProps) {
  const vaultAprFallback = useCurveVaultBreakdownApr({
    asset,
    enabled: true,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = vaultAprFallback.data as any

  return {
    ...vaultAprFallback,
    data:
      data?.crvApy !== undefined ? convertToApr(data?.crvApy) : data?.crvApr,
  }
}

export function useTokenVaultCvxApr({ asset, type }: VaultProps) {
  const isToken = useIsTokenVault(type)

  const tokenVaultSymbol = useTokenVaultSymbol({
    asset,
    enabled: isToken ?? false,
  })

  const ybTokenSymbol = tokenVaultSymbol.data

  const isCvxTokenFallbackEnabled =
    isToken && !!ybTokenSymbol && ybTokenSymbol === "fort-cvxCRV"
  const vaultAprFallback = useCurveVaultBreakdownApr({
    asset,
    enabled: isCvxTokenFallbackEnabled ?? false,
  })

  if (!isCvxTokenFallbackEnabled) {
    return {
      isLoading: false,
      data: undefined,
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = vaultAprFallback.data as any
  return {
    ...vaultAprFallback,
    data:
      data?.cvxApy !== undefined ? convertToApr(data?.cvxApy) : data?.cvxApr,
  }
}

export function useVaultCvxApr({ asset }: VaultProps) {
  const vaultAprFallback = useCurveVaultBreakdownApr({
    asset,
    enabled: true,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = vaultAprFallback.data as any
  return {
    ...vaultAprFallback,
    data:
      data?.cvxApy !== undefined ? convertToApr(data?.cvxApy) : data?.cvxApr,
  }
}

export function useVaultExtraApr({ asset }: VaultProps) {
  const vaultAprFallback = useCurveVaultBreakdownApr({
    asset,
    enabled: true,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = vaultAprFallback.data as any
  return {
    ...vaultAprFallback,
    data: data?.extraRewardsApr,
  }
}

export function useVaultTotalApr({ asset, type }: VaultProps) {
  const isCurve = useIsCurveVault(type)
  const isToken = useIsTokenVault(type)

  const isCurveFallbackEnabled = isCurve && !isToken
  const isBalancerFallbackEnabled = !isCurve && !isToken

  const curveVaultGraphTotalApr = useCurveVaultTotalApr({
    asset,
    enabled: isCurveFallbackEnabled ?? false,
  })
  const balancerVaultGraphTotalApr = useBalancerVaultTotalApr({
    asset,
    enabled: isBalancerFallbackEnabled ?? false,
  })
  const tokenVaultGraphTotalApr = useTokenVaultTotalApr({
    asset,
    enabled: isToken ?? false,
  })

  if (isCurveFallbackEnabled) {
    return curveVaultGraphTotalApr
  }

  if (isBalancerFallbackEnabled) {
    return balancerVaultGraphTotalApr
  }

  return tokenVaultGraphTotalApr
}

export function useVaultBalApr({ asset, type }: VaultProps) {
  const isToken = useIsTokenVault(type)

  const tokenVaultSymbol = useTokenVaultSymbol({
    asset,
    enabled: isToken ?? false,
  })

  const ybTokenSymbol = tokenVaultSymbol.data

  const isAuraTokenFallbackEnabled =
    isToken && !!ybTokenSymbol && ybTokenSymbol === "fort-auraBAL"
  const tokenAuraBalVault = useTokenAuraBalVault({
    asset,
    enabled: isAuraTokenFallbackEnabled ?? false,
  })

  if (!isAuraTokenFallbackEnabled) {
    return {
      isLoading: false,
      data: undefined,
    }
  }

  return {
    ...tokenAuraBalVault,
    data: tokenAuraBalVault.data?.BALApr,
  }
}

export function useVaultAuraApr({ asset, type }: VaultProps) {
  const isToken = useIsTokenVault(type)

  const tokenVaultSymbol = useTokenVaultSymbol({
    asset,
    enabled: isToken ?? false,
  })

  const ybTokenSymbol = tokenVaultSymbol.data

  const isAuraTokenFallbackEnabled =
    isToken && !!ybTokenSymbol && ybTokenSymbol === "fort-auraBAL"
  const tokenAuraBalVault = useTokenAuraBalVault({
    asset,
    enabled: isAuraTokenFallbackEnabled ?? false,
  })

  if (!isAuraTokenFallbackEnabled) {
    return {
      isLoading: false,
      data: undefined,
    }
  }

  return {
    ...tokenAuraBalVault,
    data: tokenAuraBalVault.data?.AuraApr,
  }
}

export function useVaultGmxApr({ asset, type }: VaultProps) {
  const isToken = useIsTokenVault(type)

  const tokenVaultSymbol = useTokenVaultSymbol({
    asset,
    enabled: isToken ?? false,
  })

  const ybTokenSymbol = tokenVaultSymbol.data

  const isGlpTokenFallbackEnabled =
    isToken && !!ybTokenSymbol && ybTokenSymbol === "fortGLP"
  const tokenGlpVault = useTokenGlpVault({
    asset,
    enabled: isGlpTokenFallbackEnabled ?? false,
  })

  return {
    ...tokenGlpVault,
    data: tokenGlpVault.data?.GMXApr,
  }
}

export function useVaultEthApr({ asset, type }: VaultProps) {
  const isToken = useIsTokenVault(type)

  const tokenVaultSymbol = useTokenVaultSymbol({
    asset,
    enabled: isToken ?? false,
  })

  const ybTokenSymbol = tokenVaultSymbol.data

  const isGlpTokenFallbackEnabled =
    isToken && !!ybTokenSymbol && ybTokenSymbol === "fortGLP"
  const tokenGlpVault = useTokenGlpVault({
    asset,
    enabled: isGlpTokenFallbackEnabled ?? false,
  })

  return {
    ...tokenGlpVault,
    data: tokenGlpVault.data?.ETHApr,
  }
}
