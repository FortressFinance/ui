import { useQuery } from "@tanstack/react-query"
import { Address } from "wagmi"

import { getConcentratorStaticData } from "@/lib/api/concentrators"
import { queryKeys } from "@/lib/helpers"
import { useActiveChainId } from "@/hooks/useActiveChainId"

export function useApiConcentratorTargetAssets(
  options: {
    onSuccess?: (data: Address[]) => void
  } = {}
) {
  const chainId = useActiveChainId()
  return {
    ...useQuery({
      ...queryKeys.concentrators.list({ chainId }),
      queryFn: () => getConcentratorStaticData({ chainId }),
      retry: false,
      select: (data) => {
        return Array.from(
          new Set(data.map(({ target_asset }) => target_asset.address))
        )
      },
      onSuccess: options.onSuccess,
    }),
  }
}
