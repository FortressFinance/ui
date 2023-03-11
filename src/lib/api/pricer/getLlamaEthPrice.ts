import axios from "axios"

import { LLAMA_URL } from "@/constant/env"

export async function getLlamaEthPrice() {
  const resp = await axios.get(`${LLAMA_URL}coingecko:ethereum`)
  const coins = resp?.data?.coins
  const ethToken = coins?.[`coingecko:ethereum`]
  return ethToken?.price
}