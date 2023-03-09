import request, { gql } from "graphql-request"
import { Address, useQuery } from "wagmi"

import { CURVE_GRAPH_URL } from "@/constant/env"

async function getCurveLpTokenPrice(token: string) {
  const graphqlQuery = gql`
    query Pool($lpToken: String!){
      pools(where: { lpToken: $lpToken}) {
          lpTokenUSDPrice
      }
    }
  `
  const variables = {
    lpToken: token ?? "0x",
  }

  const data = await request(CURVE_GRAPH_URL, graphqlQuery, variables)
  let price = 0
  if (data?.pools?.length !== 0) {
    price = Number(data?.pools[0].lpTokenUSDPrice)
  }
  return price
}

export default function useCurveLpTokenPricer({
  primaryAsset,
  enabled,
}: {
  primaryAsset: Address | undefined,
  enabled: boolean
}) {
  return useQuery(
    ["curveLpTokenPricer", primaryAsset?? "0x"], 
    {
      queryFn: () => getCurveLpTokenPrice(primaryAsset?? "0x"),
      retry: false,
      enabled: enabled,
  })
}