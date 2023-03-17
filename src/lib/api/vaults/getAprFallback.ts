import axios from "axios"
import { BigNumber } from "ethers"
import request, { gql } from "graphql-request"
import { Address } from "wagmi"

import { getGmxPriceData } from "@/lib/api/pricer/getGlpPrice"
import { getLlamaPrice } from "@/lib/api/pricer/getLlamaPrice"
import { VaultProps } from "@/lib/types"

import {
  auraBalTokenAddress,
  auraTokenAddress,
  ethTokenAddress,
} from "@/constant/addresses"
import {
  auraFinanceUrl,
  auraGraphUrl,
  convexStakingUrl,
  curveGraphUrl,
} from "@/constant/urls"

// TODO: These should use types
// await request<Response, Variables>(...)

export async function getVaultAprFallback(asset: VaultProps["asset"]) {
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

  const data = await request(curveGraphUrl, graphqlQuery, variables)
  return data?.pools
}

export async function getFortGlpAprFallback(
  ethRewardsPerSecond: BigNumber | undefined
) {
  const { aum, priceGmx } = await getGmxPriceData()
  const ethRewardsAnnual =
    ((ethRewardsPerSecond ?? BigNumber.from(0)).toNumber() * 3600 * 24 * 365) /
    1e18
  const ethPrice = await getLlamaPrice({ asset: ethTokenAddress })
  const gmxRewardsMonthlyEmissionRate = 0 // need to know why is it zero
  const esGmxRewards = priceGmx * gmxRewardsMonthlyEmissionRate * 12
  const aprGmx = esGmxRewards / aum
  const aprEth = (ethRewardsAnnual * ethPrice) / aum
  const totalApr = aprGmx + aprEth
  return {
    GMXApr: aprGmx,
    ETHApr: aprEth,
    totalApr: totalApr,
  }
}

export async function getFortCvxCrvAprFallback() {
  const graphqlQuery = gql`
    query MyQuery {
      dailySnapshots(orderBy: timestamp, orderDirection: desc) {
        crvApr
        cvxApr
        extraRewardsApr {
          apr
          token
          tokenName
        }
      }
    }
  `
  const data = await request(convexStakingUrl, graphqlQuery)
  if (data?.dailySnapshots?.length !== 0) {
    const crvApr = Number(data?.dailySnapshots[0].crvApr)
    const cvxApr = Number(data?.dailySnapshots[0].cvxApr)
    const extraRewardsAprList = data?.dailySnapshots[0].extraRewardsApr
    let extraRewardsApr = 0
    if (extraRewardsAprList?.length !== 0) {
      extraRewardsApr = Number(extraRewardsAprList[0].apr)
    }
    const totalApr = crvApr + cvxApr + extraRewardsApr
    return {
      crvApr: crvApr,
      cvxApr: cvxApr,
      extraRewardsApr: extraRewardsApr,
      totalApr: totalApr,
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getFortAuraBalAprFallback(auraMint: any) {
  const { rewardRates, addresses, totalStaked } = await getAuraBalRewardData()
  const tvl =
    (await getLlamaPrice({ asset: auraBalTokenAddress })) *
    (Number(totalStaked) / 1e18)

  let aprTokens = 0
  Object.entries(addresses).map(async ([key, val]) => {
    const apr = await getTokenAPR(Number(rewardRates[key]) / 1e18, val, tvl)
    aprTokens += apr
  })

  const BalYearlyRewards = (Number(rewardRates["BAL"]) / 1e18) * 86_400 * 365
  const AuraRewardYearly = calculateAuraMintAmount(auraMint, BalYearlyRewards)
  const AuraRewardAnnualUsd =
    AuraRewardYearly * (await getLlamaPrice({ asset: auraTokenAddress }))
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

  const data = await request(auraGraphUrl, graphqlQuery)
  let rewardData = []
  let totalStaked = 0
  const addresses: { [key: string]: Address } = {}
  const rewardRates: { [key: string]: string } = {}
  rewardData = data.pool?.rewardData
  totalStaked = data.pool?.totalStaked
  rewardData?.map(
    (d: { token: { symbol: string; id: string }; rewardRate: string }) => {
      addresses[d?.token?.symbol] = d?.token?.id as Address
      rewardRates[d?.token?.symbol] = d?.rewardRate
    }
  )
  return {
    rewardRates,
    addresses,
    totalStaked,
  }
}

export async function getBalancerTotalAprFallback(
  asset: VaultProps["asset"],
  extraTokenAwards: number | undefined,
  swapFee: number | undefined,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    AuraRewardYearly * (await getLlamaPrice({ asset: auraTokenAddress }))
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

async function getTokenAPR(rewardRate: number, token: Address, tvl: number) {
  const rewardYearly = rewardRate * 86_400 * 365
  const tokenPriceUsd = await getLlamaPrice({ asset: token })
  const rewardAnnualUsd = rewardYearly * tokenPriceUsd
  const tokenApr = rewardAnnualUsd / tvl
  return tokenApr
}

export async function fetchApiAuraFinance(asset: VaultProps["asset"]) {
  const resp = await axios.get(auraFinanceUrl)
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

export async function getAuraMint() {
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

  const data = await request(auraGraphUrl, graphqlQuery)
  return data?.global
}

async function getAuraRewardDataByAsset(asset: VaultProps["asset"]) {
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

  const data = await request(auraGraphUrl, graphqlQuery, variables)
  let rewardData = []
  let totalStaked = 0
  const addresses: { [key: string]: Address } = {}
  const rewardRates: { [key: string]: string } = {}
  if (data?.pools?.length !== 0) {
    rewardData = data.pools[0].rewardData
    totalStaked = data.pools[0].totalStaked
    rewardData?.map(
      (d: { token: { symbol: string; id: string }; rewardRate: string }) => {
        addresses[d?.token?.symbol] = d?.token?.id as Address
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
