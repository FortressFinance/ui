import { useQuery } from "@tanstack/react-query"

import { getConcentratorStaticData } from "@/lib/api/concentrators"
import { queryKeys } from "@/lib/helpers"
import { useActiveChainId } from "@/hooks"

export function useApiConcentratorStaticData({
  enabled,
}: {
  enabled?: boolean
}) {
  const chainId = useActiveChainId()
  return {
    ...useQuery({
      ...queryKeys.concentrators.list({ chainId }),
      queryFn: () => getConcentratorStaticData({ chainId }),
      enabled,
      retry: false,
    }),
    isEnabled: enabled,
  }
}
