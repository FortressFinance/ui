import { useQueries } from "@tanstack/react-query"
import { useContractRead, useQuery } from "wagmi"

import {
  fetchApiAuraFinance,
  getAuraMint,
  getBalancerTotalAprFallback,
  getFortAuraBalAprFallback,
  getFortCvxCrvAprFallback,
  getFortGlpAprFallback,
  getVaultAprFallback,
} from "@/lib/aprFallback"
import { useApiVaultDynamic } from "@/hooks/api"
import { VaultDynamicProps } from "@/hooks/types"
import useIsCurve from "@/hooks/useIsCurve"
import useIsTokenCompounder from "@/hooks/useIsTokenCompounder"
import useRegistryContract from "@/hooks/useRegistryContract"

import glpRewardsDistributorAbi from "@/constant/abi/glpRewardsDistributorAbi"
import { GLP_REWARDS_DISTRIBUTOR_ADDRESS } from "@/constant/env"

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

  // CURVE
  const vaultAprFallback = useQuery([_address, "vaultAprFallback"], {
    queryFn: async () => await getVaultAprFallback(_address),
    retry: false,
    enabled:
      (apiQuery.isError || apiQuery.data === null) && !isToken && isCurve,
  })
  // END OF CURVE

  // BALANCER
  const auraQuery = useQueries({
    queries: [
      {
        queryKey: [_address, "auraFinance"],
        queryFn: async () => await fetchApiAuraFinance(_address),
        staleTime: Infinity,
        enabled:
          (apiQuery.isError || apiQuery.data === null) && !isToken && !isCurve,
      },
      {
        queryKey: [_address, "auraMint"],
        queryFn: async () => await getAuraMint(),
        staleTime: Infinity,
        enabled:
          (apiQuery.isError || apiQuery.data === null) && !isToken && !isCurve,
      },
    ],
  })

  const extraTokenAwards = auraQuery?.[0].data?.extraTokenAwards
  const swapFee = auraQuery?.[0].data?.swapFee
  const auraMint = auraQuery?.[1].data

  const balancerTotalAprFallbackQuery = useQuery(
    [_address, "balancerTotalAprFallback", extraTokenAwards, swapFee],
    {
      queryFn: async () =>
        await getBalancerTotalAprFallback(
          _address,
          extraTokenAwards,
          swapFee,
          auraMint
        ),
      retry: false,
      enabled:
        (apiQuery.isError || apiQuery.data === null) &&
        !!swapFee &&
        !!extraTokenAwards &&
        !!auraMint &&
        !isToken &&
        !isCurve,
    }
  )
  // END OF BALANCER

  // TOKEN
  const registryQuery = useContractRead({
    ...useRegistryContract(),
    functionName: "getTokenCompounderSymbol",
    args: [_address ?? "0x"],
    enabled: (apiQuery.isError || apiQuery.data === null) && isToken,
  })

  const ybTokenSymbol = registryQuery.data

  const auraTokenQuery = useQuery([_address, "auraMint"], {
    queryFn: async () => await getAuraMint(),
    retry: false,
    enabled:
      (apiQuery.isError || apiQuery.data === null) &&
      isToken &&
      !!ybTokenSymbol &&
      ybTokenSymbol === "fort-auraBAL",
  })

  const auraTokenMint = auraTokenQuery.data

  const fortAuraBalAprFallback = useQuery(
    [_address, "fortAuraBalAprFallback"],
    {
      queryFn: async () => await getFortAuraBalAprFallback(auraTokenMint),
      retry: false,
      enabled:
        !!ybTokenSymbol && !!auraTokenMint && ybTokenSymbol === "fort-auraBAL",
    }
  )

  const fortCvxCrvAprFallback = useQuery([_address, "fortCvxCrvAprFallback"], {
    queryFn: async () => await getFortCvxCrvAprFallback(),
    retry: false,
    enabled: !!ybTokenSymbol && ybTokenSymbol === "fort-cvxCRV",
  })

  const glpQuery = useContractRead({
    abi: glpRewardsDistributorAbi,
    address: GLP_REWARDS_DISTRIBUTOR_ADDRESS as `0x${string}`,
    functionName: "tokensPerInterval",
    enabled: !!ybTokenSymbol && ybTokenSymbol === "fortGLP",
  })

  const ethRewardsPerSecond = glpQuery.data

  const fortGlpAprFallback = useQuery([_address, "fortGlpAprFallback"], {
    queryFn: async () => await getFortGlpAprFallback(ethRewardsPerSecond),
    retry: false,
    enabled:
      !!ybTokenSymbol && !!ethRewardsPerSecond && ybTokenSymbol === "fortGLP",
  })
  // END OF TOKEN

  if (
    !vaultAprFallback.isError &&
    !!vaultAprFallback.data &&
    vaultAprFallback.data.length > 0
  ) {
    return {
      ...vaultAprFallback,
      data:
        Number(vaultAprFallback.data?.[0].baseApr) +
        Number(vaultAprFallback.data?.[0].crvApr) +
        Number(vaultAprFallback.data?.[0].cvxApr) +
        Number(vaultAprFallback.data?.[0].extraRewardsApr),
    }
  }

  if (
    !balancerTotalAprFallbackQuery.isError &&
    !!balancerTotalAprFallbackQuery.data
  ) {
    return {
      ...balancerTotalAprFallbackQuery,
      data: balancerTotalAprFallbackQuery.data.totalApr,
    }
  }

  if (!fortAuraBalAprFallback.isError && !!fortAuraBalAprFallback.data) {
    return {
      ...fortAuraBalAprFallback,
      data: fortAuraBalAprFallback.data.totalApr,
    }
  }

  if (!fortCvxCrvAprFallback.isError && !!fortCvxCrvAprFallback.data) {
    return {
      ...fortCvxCrvAprFallback,
      data: fortCvxCrvAprFallback.data.totalApr,
    }
  }

  if (!fortGlpAprFallback.isError && !!fortGlpAprFallback.data) {
    return {
      ...fortGlpAprFallback,
      data: fortGlpAprFallback.data.totalApr,
    }
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

  const registryQuery = useContractRead({
    ...useRegistryContract(),
    functionName: "getTokenCompounderSymbol",
    args: [_address ?? "0x"],
    enabled: (apiQuery.isError || apiQuery.data === null) && isToken,
  })

  const ybTokenSymbol = registryQuery.data

  const auraTokenQuery = useQuery([_address, "auraMint"], {
    queryFn: async () => await getAuraMint(),
    retry: false,
    enabled:
      (apiQuery.isError || apiQuery.data === null) &&
      isToken &&
      !!ybTokenSymbol &&
      ybTokenSymbol === "fort-auraBAL",
  })

  const auraTokenMint = auraTokenQuery.data

  const fortAuraBalAprFallback = useQuery(
    [_address, "fortAuraBalAprFallback"],
    {
      queryFn: async () => await getFortAuraBalAprFallback(auraTokenMint),
      retry: false,
      enabled:
        !!ybTokenSymbol && !!auraTokenMint && ybTokenSymbol === "fort-auraBAL",
    }
  )

  if (!fortAuraBalAprFallback.isError && !!fortAuraBalAprFallback.data) {
    return {
      ...fortAuraBalAprFallback,
      data: fortAuraBalAprFallback.data.BALApr,
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

  const registryQuery = useContractRead({
    ...useRegistryContract(),
    functionName: "getTokenCompounderSymbol",
    args: [_address ?? "0x"],
    enabled: (apiQuery.isError || apiQuery.data === null) && isToken,
  })

  const ybTokenSymbol = registryQuery.data

  const auraTokenQuery = useQuery([_address, "auraMint"], {
    queryFn: async () => await getAuraMint(),
    retry: false,
    enabled:
      (apiQuery.isError || apiQuery.data === null) &&
      isToken &&
      !!ybTokenSymbol &&
      ybTokenSymbol === "fort-auraBAL",
  })

  const auraTokenMint = auraTokenQuery.data

  const fortAuraBalAprFallback = useQuery(
    [_address, "fortAuraBalAprFallback"],
    {
      queryFn: async () => await getFortAuraBalAprFallback(auraTokenMint),
      retry: false,
      enabled:
        !!ybTokenSymbol && !!auraTokenMint && ybTokenSymbol === "fort-auraBAL",
    }
  )

  if (!fortAuraBalAprFallback.isError && !!fortAuraBalAprFallback.data) {
    return {
      ...fortAuraBalAprFallback,
      data: fortAuraBalAprFallback.data.AuraApr,
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

  const registryQuery = useContractRead({
    ...useRegistryContract(),
    functionName: "getTokenCompounderSymbol",
    args: [_address ?? "0x"],
    enabled: (apiQuery.isError || apiQuery.data === null) && isToken,
  })

  const ybTokenSymbol = registryQuery.data

  const glpQuery = useContractRead({
    abi: glpRewardsDistributorAbi,
    address: GLP_REWARDS_DISTRIBUTOR_ADDRESS as `0x${string}`,
    functionName: "tokensPerInterval",
    enabled: !!ybTokenSymbol && ybTokenSymbol === "fortGLP",
  })

  const ethRewardsPerSecond = glpQuery.data

  const fortGlpAprFallback = useQuery([_address, "fortGlpAprFallback"], {
    queryFn: async () => await getFortGlpAprFallback(ethRewardsPerSecond),
    retry: false,
    enabled:
      !!ybTokenSymbol && !!ethRewardsPerSecond && ybTokenSymbol === "fortGLP",
  })

  if (!fortGlpAprFallback.isError && !!fortGlpAprFallback.data) {
    return {
      ...fortGlpAprFallback,
      data: fortGlpAprFallback.data.GMXApr,
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

  const registryQuery = useContractRead({
    ...useRegistryContract(),
    functionName: "getTokenCompounderSymbol",
    args: [_address ?? "0x"],
    enabled: (apiQuery.isError || apiQuery.data === null) && isToken,
  })

  const ybTokenSymbol = registryQuery.data

  const glpQuery = useContractRead({
    abi: glpRewardsDistributorAbi,
    address: GLP_REWARDS_DISTRIBUTOR_ADDRESS as `0x${string}`,
    functionName: "tokensPerInterval",
    enabled: !!ybTokenSymbol && ybTokenSymbol === "fortGLP",
  })

  const ethRewardsPerSecond = glpQuery.data

  const fortGlpAprFallback = useQuery([_address, "fortGlpAprFallback"], {
    queryFn: async () => await getFortGlpAprFallback(ethRewardsPerSecond),
    retry: false,
    enabled:
      !!ybTokenSymbol && !!ethRewardsPerSecond && ybTokenSymbol === "fortGLP",
  })

  if (!fortGlpAprFallback.isError && !!fortGlpAprFallback.data) {
    return {
      ...fortGlpAprFallback,
      data: fortGlpAprFallback.data.ETHApr,
    }
  }
  return {
    ...apiQuery,
    data: apiQuery.data?.APR?.ETHApr,
  }
}
