import axios from "axios"

import { ALADDIN_URL } from "@/constant/env"

export async function getAladdinApiPrice(token: string) {
  const resp = await axios.get(`${ALADDIN_URL}`)
  const pools = resp?.data?.data
  const pool = pools?.[`${token}`]
  return pool?.usd
}
