import request, { gql } from "graphql-request"
import { Address, useQuery } from "wagmi"

import { GXM_GRAPH_URL } from "@/constant/env"

export async function getGmxPriceData() {
  const graphqlQuery = gql`
    {
      glpStats(orderBy: id, orderDirection: desc) {
        id
        aumInUsdg
        glpSupply
      }
      uniswapPrices(orderBy: id, orderDirection: desc) {
        value
      }
    }
  `
  const data = await request(GXM_GRAPH_URL, graphqlQuery)
  let aum = 0
  let priceGmx = 0
  if (data?.glpStats?.length !== 0) {
    aum = Number(data?.glpStats[0].aumInUsdg) / 1e18
  }
  if (data?.uniswapPrices?.length !== 0) {
    priceGmx = Number(data?.uniswapPrices[0].value) / 1e30
  }
  return {
    aum,
    priceGmx,
  }
}

async function getGlpPrice() {
  const graphqlQuery = gql`
    {
      glpStats(orderBy: id, orderDirection: desc) {
        id
        aumInUsdg
        glpSupply
      }
    }
  `
  const data = await request(GXM_GRAPH_URL, graphqlQuery)
  let aum = 0
  let supply = 0
  if (data?.glpStats?.length !== 0) {
    aum = Number(data?.glpStats[0].aumInUsdg)
    supply = Number(data?.glpStats[0].glpSupply)
  }
  return aum/supply
}

export default function useGlpPricer({
  primaryAsset,
  enabled,
}: {
  primaryAsset: Address | undefined,
  enabled: boolean
}) {
  return useQuery(
    ["glpPricer", primaryAsset?? "0x"], 
    {
      queryFn: () => getGlpPrice(),
      retry: false,
      enabled: enabled,
  })
}