import { useQueries } from "@tanstack/react-query"
import axios from "axios"
import request, { gql } from "graphql-request"
import { useContractRead, useQuery } from "wagmi"

import { useApiVaultDynamic } from "@/hooks/api"
import { VaultDynamicProps } from "@/hooks/types"
import useIsCurve from "@/hooks/useIsCurve"
import useIsTokenCompounder from "@/hooks/useIsTokenCompounder"
import useRegistryContract from "@/hooks/useRegistryContract"

import {
  AURA_ADDRESS,
  AURA_BAL_ADDRESS,
  AURA_FINANCE_URL,
  AURA_GRAPH_URL,
  CURVE_GRAPH_URL,
  LLAMA_URL,
} from "@/constant/env"

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

async function getVaultAprFallback(asset: VaultDynamicProps["asset"]) {
  const graphqlQuery = gql`
    query Pool($lpToken: String!) {
      pools(where: { lpToken: $lpToken }) {
        # name
        # id
        # poolid
        # lpToken
        # token
        baseApr
        crvApr
        cvxApr
        extraRewardsApr
      }
    }
  `
  const variables = {
    lpToken: asset ?? "0x",
  }

  const data = await request(CURVE_GRAPH_URL, graphqlQuery, variables)
  return data?.pools
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
  const auraTokenQuery = useQuery([_address, "auraMint"], {
    queryFn: async () => await getAuraMint(),
    retry: false,
    enabled: isToken,
  })

  const registryQuery = useContractRead({
    ...useRegistryContract(),
    functionName: "getTokenCompounderSymbol",
    args: [_address ?? "0x"],
    //enabled: (apiQuery.isError || apiQuery.data === null) && isToken,
    enabled: isToken,
  })

  const ybTokenSymbol = registryQuery.data
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

  return {
    ...apiQuery,
    data: apiQuery.data?.APR?.totalApr,
  }
}

async function getFortAuraBalAprFallback(auraMint: any) {
  const { rewardRates, addresses, totalStaked } = await getAuraBalRewardData()
  const tvl =
    (await getTokenPriceUsd(AURA_BAL_ADDRESS)) * (Number(totalStaked) / 1e18)

  let aprTokens = 0
  Object.entries(addresses).map(async ([key, val]) => {
    const apr = await getTokenAPR(Number(rewardRates[key]) / 1e18, val, tvl)
    aprTokens += apr
  })

  const BalYearlyRewards = (Number(rewardRates["BAL"]) / 1e18) * 86_400 * 365
  const AuraRewardYearly = calculateAuraMintAmount(auraMint, BalYearlyRewards)
  const AuraRewardAnnualUsd =
    AuraRewardYearly * (await getTokenPriceUsd(AURA_ADDRESS))
  const aprAura = AuraRewardAnnualUsd / tvl

  const aprTotal = aprTokens + aprAura
  return {
    BALApr: aprTokens,
    AuraApr: aprAura,
    totalApr: aprTotal,
  }
}

async function getAuraBalRewardData() {
  const graphqlQuery = gql`
    {
      pool(id: "auraBal") {
        totalStaked
        rewardData {
          rewardRate
          token {
            id
            symbol
          }
        }
      }
    }
  `

  const data = await request(AURA_GRAPH_URL, graphqlQuery)
  let rewardData = []
  let totalStaked = 0
  const addresses: { [key: string]: string } = {}
  const rewardRates: { [key: string]: string } = {}
  rewardData = data.pool?.rewardData
  totalStaked = data.pool?.totalStaked
  rewardData?.map(
    (d: { token: { symbol: string; id: string }; rewardRate: string }) => {
      addresses[d?.token?.symbol] = d?.token?.id
      rewardRates[d?.token?.symbol] = d?.rewardRate
    }
  )
  return {
    rewardRates,
    addresses,
    totalStaked,
  }
}

async function getBalancerTotalAprFallback(
  asset: VaultDynamicProps["asset"],
  extraTokenAwards: number | undefined,
  swapFee: number | undefined,
  auraMint: any
) {
  const { rewardRates, addresses, totalStaked } =
    await getAuraRewardDataByAsset(asset)
  const lpTokenPrice = 1297
  const tvl = (totalStaked / 1e18) * lpTokenPrice
  let aprTokens = 0
  Object.entries(addresses).map(async ([key, val]) => {
    const apr = await getTokenAPR(Number(rewardRates[key]) / 1e18, val, tvl)
    aprTokens += apr
  })

  const BalYearlyRewards = (Number(rewardRates["BAL"]) / 1e18) * 86_400 * 365
  const AuraRewardYearly = calculateAuraMintAmount(auraMint, BalYearlyRewards)
  const AuraRewardAnnualUsd =
    AuraRewardYearly * (await getTokenPriceUsd(AURA_ADDRESS))
  const aprAura = AuraRewardAnnualUsd / tvl

  const aprTotal =
    aprTokens + aprAura + (swapFee ?? 0) + (extraTokenAwards ?? 0)

  return {
    BALApr: aprTokens,
    swapFeeApr: swapFee ?? 0,
    AuraApr: aprAura,
    extraRewardsApr: extraTokenAwards ?? 0,
    totalApr: aprTotal,
  }
}

function calculateAuraMintAmount(auraMint: any, BALYearlyRewards: number) {
  const reductionPerCliff = Number(auraMint.auraReductionPerCliff)
  const maxSupply = Number(auraMint.auraMaxSupply)
  const totalSupply = Number(auraMint.auraTotalSupply)
  const totalCliffs = Number(auraMint.auraTotalCliffs)
  const minterMinted = Number(auraMint.auraMinterMinted)

  const emissionsMinted = totalSupply - maxSupply - minterMinted
  const cliff = emissionsMinted / reductionPerCliff

  if (cliff < totalCliffs) {
    const reduction = (totalCliffs - cliff) * 2.5 + 700
    let amount = (BALYearlyRewards * reduction) / totalCliffs
    const amtTillMax = maxSupply - emissionsMinted

    if (amount > amtTillMax) {
      amount = amtTillMax
    }

    return amount
  }

  return 0
}

async function getTokenAPR(rewardRate: number, token: string, tvl: number) {
  const rewardYearly = rewardRate * 86_400 * 365
  const tokenPriceUsd = await getTokenPriceUsd(token)
  const rewardAnnualUsd = rewardYearly * tokenPriceUsd
  const tokenApr = rewardAnnualUsd / tvl
  return tokenApr
}

async function getTokenPriceUsd(token: string) {
  const resp = await axios.get(`${LLAMA_URL}ethereum:${token}`)
  const coins = resp?.data?.coins
  const ethToken = coins?.[`ethereum:${token}`]
  return ethToken?.price
}

async function fetchApiAuraFinance(asset: VaultDynamicProps["asset"]) {
  const resp = await axios.get(`${AURA_FINANCE_URL}`)
  const pools = resp?.data?.pools
  const relevantAsset = pools.find((pool: { id: string }) => {
    if (asset === undefined) {
      return false
    }
    const assetStr = asset.toLocaleLowerCase()
    const id = pool?.id.toLocaleLowerCase()
    return id.startsWith(assetStr)
  })
  const extraTokenAwards = relevantAsset?.poolAprs?.tokens?.total
  const swapFee = relevantAsset?.poolAprs.swap
  return { extraTokenAwards: extraTokenAwards / 100, swapFee: swapFee / 100 }
}

async function getAuraMint() {
  const graphqlQuery = gql`
    query MyQuery {
      global(id: "global") {
        auraMaxSupply
        auraMinterMinted
        auraReductionPerCliff
        auraTotalSupply
        auraTotalCliffs
      }
    }
  `

  const data = await request(AURA_GRAPH_URL, graphqlQuery)
  return data?.global
}

async function getAuraRewardDataByAsset(asset: VaultDynamicProps["asset"]) {
  const graphqlQuery = gql`
    query Pool($lpToken: Bytes!) {
      pools(where: { lpToken: $lpToken }) {
        rewardData {
          rewardRate
          token {
            symbol
            id
          }
        }
        totalStaked
      }
    }
  `
  const variables = {
    lpToken: asset?.toLocaleLowerCase() ?? "0x",
  }

  const data = await request(AURA_GRAPH_URL, graphqlQuery, variables)
  let rewardData = []
  let totalStaked = 0
  const addresses: { [key: string]: string } = {}
  const rewardRates: { [key: string]: string } = {}
  if (data?.pools?.length !== 0) {
    rewardData = data.pools[0].rewardData
    totalStaked = data.pools[0].totalStaked
    rewardData?.map(
      (d: { token: { symbol: string; id: string }; rewardRate: string }) => {
        addresses[d?.token?.symbol] = d?.token?.id
        rewardRates[d?.token?.symbol] = d?.rewardRate
      }
    )
  }
  return {
    rewardRates,
    addresses,
    totalStaked,
  }
}

export function useVaultBalApr({
  asset: _address,
  poolId,
  type,
}: VaultDynamicProps) {
  // Preferred: API request
  const apiQuery = useApiVaultDynamic({ poolId, type })
  // TODO: Fallbacks?
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
  // Preferred: API request
  const apiQuery = useApiVaultDynamic({ poolId, type })
  // TODO: Fallbacks?
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
  // Preferred: API request
  const apiQuery = useApiVaultDynamic({ poolId, type })
  // TODO: Fallbacks?
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
  // Preferred: API request
  const apiQuery = useApiVaultDynamic({ poolId, type })
  // TODO: Fallbacks?
  return {
    ...apiQuery,
    data: apiQuery.data?.APR?.ETHApr,
  }
}
