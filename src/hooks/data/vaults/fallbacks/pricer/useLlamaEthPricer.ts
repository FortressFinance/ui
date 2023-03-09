import axios from "axios"
import { Address, useQuery } from "wagmi"

import { LLAMA_URL } from "@/constant/env"

export async function getLlamaEthPrice() {
  const resp = await axios.get(`${LLAMA_URL}coingecko:ethereum`)
  const coins = resp?.data?.coins
  const ethToken = coins?.[`coingecko:ethereum`]
  return ethToken?.price
}

export default function useLlamaEthPricer({
  primaryAsset,
  enabled,
}: {
  primaryAsset: Address | undefined,
  enabled: boolean
}) {
  return useQuery(
    ["llamaEthPricer", primaryAsset?? "0x"], 
    {
      queryFn: () => getLlamaEthPrice(),
      retry: false,
      enabled: enabled,
  })
}