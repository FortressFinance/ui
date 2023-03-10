import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Address } from "wagmi"

import { APY_VISION_URL } from "@/constant/env"

export async function getApyVisionApiPrice(token: string) {
  const resp = await axios.get(
    `${APY_VISION_URL}/${token}/0?type=0&source=balancerv2_eth`
  )
  const data = resp?.data
  return data?.[`price`]
}

export default function useApyVisionApiPricer({
  primaryAsset,
  enabled,
}: {
  primaryAsset: Address | undefined
  enabled: boolean
}) {
  return useQuery(["apyVisionApiPricer", primaryAsset ?? "0x"], {
    queryFn: () => getApyVisionApiPrice(primaryAsset ?? "0x"),
    retry: false,
    enabled: enabled,
  })
}
