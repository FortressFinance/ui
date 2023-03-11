import axios from "axios"
import { Address, useQuery } from "wagmi"

import { CURVE_FACTORY_CRYPTO_URL } from "@/constant/env"

export async function getCurveFactoryCryptoPrice(token: string) {
  const resp = await axios.get(`${CURVE_FACTORY_CRYPTO_URL}`)
  const data = resp?.data?.data
  const poolData = data?.[`poolData`]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const coins = poolData.map((pool: any) => pool?.[`coins`]).flat()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const relevantCoin = coins.filter((x: any) => x?.["address"] === token)
  return relevantCoin?.[0]?.["usdPrice"]
}

export default function useCurveFactoryCryptoPricer({
  primaryAsset,
  enabled,
}: {
  primaryAsset: Address | undefined
  enabled: boolean
}) {
  return useQuery(["curveFactoryCryptoPricer", primaryAsset ?? "0x"], {
    queryFn: () => getCurveFactoryCryptoPrice(primaryAsset ?? "0x"),
    retry: false,
    enabled: enabled,
  })
}
