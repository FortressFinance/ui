import axios from "axios"

import { LLAMA_URL } from "@/constant/env"

export async function getLlamaArbiApiPrice(token: string) {
  const resp = await axios.get(`${LLAMA_URL}arbitrum:${token}`)
  const coins = resp?.data?.coins
  const ethToken = coins?.[`arbitrum:${token}`]
  return ethToken?.price
}
