import request, { gql } from "graphql-request"

import { gmxGraphUrl } from "@/constant/urls"

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await request<any>(gmxGraphUrl, graphqlQuery)
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

export async function getGlpPrice() {
  const graphqlQuery = gql`
    {
      glpStats(orderBy: id, orderDirection: desc) {
        id
        aumInUsdg
        glpSupply
      }
    }
  `
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await request<any>(gmxGraphUrl, graphqlQuery)
  let aum = 0
  let supply = 0
  if (data?.glpStats?.length !== 0) {
    aum = Number(data?.glpStats[0].aumInUsdg)
    supply = Number(data?.glpStats[0].glpSupply)
  }
  return aum / supply
}
