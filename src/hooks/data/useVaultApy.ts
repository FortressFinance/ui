import axios from "axios"
import request, { gql } from "graphql-request"
import { useQuery } from "wagmi"

import { useApiVaultDynamic } from "@/hooks/api"
import { VaultDynamicProps } from "@/hooks/types"
import useIsCurve from "@/hooks/useIsCurve"
import useIsTokenCompounder from "@/hooks/useIsTokenCompounder"

import { AURA_FINANCE_URL, AURA_GRAPH_URL, CURVE_GRAPH_URL, LLAMA_URL } from "@/constant/env"

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

  const vaultAprFallback =  useQuery([_address, "vaultAprFallback"], {
    queryFn: async () => await getVaultAprFallback(_address),
    retry: false,
    enabled: apiQuery.isError || apiQuery.data === null
  })

  if (!vaultAprFallback.isError && !!vaultAprFallback.data && vaultAprFallback.data.length > 0) {  
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

async function getVaultAprFallback(asset: VaultDynamicProps["asset"]){
  const graphqlQuery = gql`
    query Pool($lpToken: String!){
      pools(where: { lpToken: $lpToken}) {
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

  const data = await request(CURVE_GRAPH_URL,graphqlQuery, variables)
  return data?.pools
}

export function useVaultCrvApr({
  asset: _address,
  poolId,
  type,
}: VaultDynamicProps) {
  // Preferred: API request
  const apiQuery = useApiVaultDynamic({ poolId, type })

  const vaultAprFallback =  useQuery([_address, "vaultAprFallback"], {
    queryFn: async () => await getVaultAprFallback(_address),
    retry: false,
    enabled: apiQuery.isError || apiQuery.data === null
  })

  if (!vaultAprFallback.isError && !!vaultAprFallback.data && vaultAprFallback.data.length > 0) {  
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

  const vaultAprFallback =  useQuery([_address, "vaultAprFallback"], {
    queryFn: async () => await getVaultAprFallback(_address),
    retry: false,
    enabled: apiQuery.isError || apiQuery.data === null
  })

  if (!vaultAprFallback.isError && !!vaultAprFallback.data && vaultAprFallback.data.length > 0) {  
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

  const vaultAprFallback =  useQuery([_address, "vaultAprFallback"], {
    queryFn: async () => await getVaultAprFallback(_address),
    retry: false,
    enabled: apiQuery.isError || apiQuery.data === null
  })

  if (!vaultAprFallback.isError && !!vaultAprFallback.data && vaultAprFallback.data.length > 0) {  
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

  const vaultAprFallback =  useQuery([_address, "vaultAprFallback"], {
    queryFn: async () => await getVaultAprFallback(_address),
    retry: false,
    enabled: (apiQuery.isError || apiQuery.data === null) && !isToken && isCurve
  })

  const auraQuery =  useQuery([_address, "auraFinance"], {
    queryFn: async () => await fetchApiAuraFinance(_address),
    retry: false,
    //enabled: (apiQuery.isError || apiQuery.data === null) && !isToken && !isCurve
    enabled: !isToken && !isCurve
  })

  const extraTokenAwards = auraQuery.data?.extraTokenAwards
  const swapFee = auraQuery.data?.swapFee

  const balancerTotalAprFallbackQuery =  useQuery([_address, "balancerTotalAprFallback", extraTokenAwards, swapFee], {
    queryFn: async () => await getBalancerTotalAprFallback(_address, extraTokenAwards, swapFee),
    retry: false,
    //enabled: (apiQuery.isError || apiQuery.data === null) && (!auraQuery.isError && auraQuery.data !== null) && !isToken && !isCurve
    enabled: (!!swapFee && !!extraTokenAwards) && !isToken && !isCurve
  })  

  if (!vaultAprFallback.isError && !!vaultAprFallback.data && vaultAprFallback.data.length > 0) {  
    return {
      ...vaultAprFallback,
      data: Number(vaultAprFallback.data?.[0].baseApr) + Number(vaultAprFallback.data?.[0].crvApr) + Number(vaultAprFallback.data?.[0].cvxApr) + Number(vaultAprFallback.data?.[0].extraRewardsApr)
    }
  } 

  if(!balancerTotalAprFallbackQuery.isError){
    //debugger
  }

  // if(!balancerTotalAprFallbackQuery.isError){
  //   return balancerTotalAprFallbackQuery
  // }

  return {
    ...apiQuery,
    data: apiQuery.data?.APR?.totalApr,
  }
}

async function getBalancerTotalAprFallback(asset: VaultDynamicProps["asset"], extraTokenAwards: number|undefined, swapFee:number|undefined){
  const { rewardRates, addresses, totalStaked } = await getBalancerRewardData(asset)
  const lpTokenPrice = 1297
  const tvl = (totalStaked/1e18 * lpTokenPrice)
  let aprTokens = 0
  Object.entries(addresses).map(async ([key, val]) => {
    const apr = await getTokenAPR(Number(rewardRates[key])/1e18, val, tvl)
    aprTokens += apr
  })
}

async function getTokenAPR(rewardRate, token, tvl){
  const rewardYearly = rewardRate * 86_400 * 365
  const tokenPriceUsd = await getTokenPriceUsd(token)
  const rewardAnnualUsd = rewardYearly * tokenPriceUsd
  const tokenApr = rewardAnnualUsd / tvl
  return tokenApr
}

async function getTokenPriceUsd(token){
  const resp = await axios.get(`${LLAMA_URL}ethereum:${token}`)
  const coins = resp?.data?.coins
  const ethToken = coins?.[`ethereum:${token}`]
  return ethToken?.price
}

async function fetchApiAuraFinance(asset: VaultDynamicProps["asset"]) {
  const resp = await axios.get(`${AURA_FINANCE_URL}`)
  const pools = resp?.data?.pools
  const relevantAsset = pools.find((pool: { id: string }) => { 
    if(asset === undefined){
      return false
    }
    const assetStr = asset.toLocaleLowerCase()
    const id = pool?.id.toLocaleLowerCase()
    return id.startsWith(assetStr);
  });
  const extraTokenAwards = relevantAsset?.poolAprs?.tokens?.total;
  const swapFee = relevantAsset?.poolAprs.swap
  return { extraTokenAwards: (extraTokenAwards/100), swapFee: (swapFee/100)}
}

async function getBalancerRewardData(asset: VaultDynamicProps["asset"]){
  const graphqlQuery = gql`
      query Pool($lpToken: Bytes!)          {
        pools(where: { lpToken: $lpToken}) {
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

    const data = await request(AURA_GRAPH_URL,graphqlQuery, variables)
    let rewardData = []; let totalStaked = 0;
    const addresses: { [key: string]: string } = {};
    const rewardRates : { [key: string]: string } = {};
    if(data?.pools?.length !== 0){
      rewardData = data.pools[0].rewardData
      totalStaked = data.pools[0].totalStaked
      rewardData?.map((d: { token: { symbol: string; id: string }; rewardRate: string }) => {
        addresses[d?.token?.symbol] = d?.token?.id
        rewardRates[d?.token?.symbol] = d?.rewardRate
      })
    }
    return {
      rewardRates, 
      addresses, 
      totalStaked
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
