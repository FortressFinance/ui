import axios from "axios"
import { Address, useQuery } from "wagmi"

import { ALADDIN_URL } from "@/constant/env"


async function getAladdinApiPrice(token: string) {
  const resp = await axios.get(`${ALADDIN_URL}`)
  const pools = resp?.data?.data
  const pool = pools?.[`${token}`]
  return pool?.usd
}

export default function useAladdinApiPricer({
  primaryAsset,
  enabled,
}: {
  primaryAsset: Address | undefined,
  enabled: boolean
}) {
  return useQuery(
    ["aladdinApiPricer", primaryAsset?? "0x"], 
    {
      queryFn: () => getAladdinApiPrice(primaryAsset?? "0x"),
      retry: false,
      enabled: enabled,
  })
}