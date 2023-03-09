import axios from "axios"
import { Address, useQuery } from "wagmi"

import { LLAMA_URL } from "@/constant/env"

export async function getLlamaApiPrice(token: string) {
  const resp = await axios.get(`${LLAMA_URL}ethereum:${token}`)
  const coins = resp?.data?.coins
  const ethToken = coins?.[`ethereum:${token}`]
  return ethToken?.price
}

export default function useLlamaApiPricer({
  primaryAsset,
  enabled,
}: {
  primaryAsset: Address | undefined
  enabled: boolean
}) {
  return useQuery(["llamaApiPricer", primaryAsset ?? "0x"], {
    queryFn: () => getLlamaApiPrice(primaryAsset ?? "0x"),
    retry: false,
    enabled: enabled,
  })
}
