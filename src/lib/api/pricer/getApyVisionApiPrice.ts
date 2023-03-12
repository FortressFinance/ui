import axios from "axios"

import { APY_VISION_URL } from "@/constant/env"

export async function getApyVisionApiPrice(token: string) {
  const resp = await axios.get(
    `${APY_VISION_URL}/${token}/0?type=0&source=balancerv2_eth`
  )
  const data = resp?.data
  return data?.[`price`]
}
