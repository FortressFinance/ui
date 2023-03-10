import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Address } from "wagmi"

import { CURVE_FACTORY_URL } from "@/constant/env"

export async function getCurveFactoryPrice(token: string) {
  const resp = await axios.get(`${CURVE_FACTORY_URL}`)
  const data = resp?.data?.data
  const poolData = data?.[`poolData`]
  const coins = poolData.map((pool: any) => pool?.[`coins`]).flat()
  const relevantCoin = coins.filter((x: any) => x?.["address"] === token)
  return relevantCoin?.[0]?.["usdPrice"]
}

export default function useCurveFactoryPricer({
  primaryAsset,
  enabled,
}: {
  primaryAsset: Address | undefined
  enabled: boolean
}) {
  return useQuery(["curveFactoryPricer", primaryAsset ?? "0x"], {
    queryFn: () => getCurveFactoryPrice(primaryAsset ?? "0x"),
    retry: false,
    enabled: enabled,
  })
}
