import axios from "axios"

import { LLAMA_URL } from "@/constant/env"

export async function getLlamaApiPrice(token: string) {
  const resp = await axios.get(`${LLAMA_URL}ethereum:${token}`)
  const coins = resp?.data?.coins
  const ethToken = coins?.[`ethereum:${token}`]
  return ethToken?.price
}
