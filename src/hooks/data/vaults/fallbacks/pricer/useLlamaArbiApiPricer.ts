import axios from "axios"
import { Address, useQuery } from "wagmi"

import { LLAMA_URL } from "@/constant/env"

export async function getLlamaArbiApiPrice(token: string) {
  const resp = await axios.get(`${LLAMA_URL}arbitrum:${token}`)
  const coins = resp?.data?.coins
  const ethToken = coins?.[`arbitrum:${token}`]
  return ethToken?.price
}

export default function useLlamaArbiApiPricer({
  primaryAsset,
  enabled,
}: {
  primaryAsset: Address | undefined
  enabled: boolean
}) {
  return useQuery(["llamaArbipiPricer", primaryAsset ?? "0x"], {
    queryFn: () => getLlamaArbiApiPrice(primaryAsset ?? "0x"),
    retry: false,
    enabled: enabled,
  })
}
