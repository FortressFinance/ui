import axios from "axios"

import { CURVE_FACTORY_URL } from "@/constant/env"

export async function getCurveFactoryPrice(token: string) {
  const resp = await axios.get(`${CURVE_FACTORY_URL}`)
  const data = resp?.data?.data
  const poolData = data?.[`poolData`]
  const coins = poolData.map((pool: any) => pool?.[`coins`]).flat()
  const relevantCoin = coins.filter((x: any) => x?.["address"] === token)
  return relevantCoin?.[0]?.["usdPrice"]
}