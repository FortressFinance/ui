import { useQuery } from "@tanstack/react-query"

import { getConcentratorStaticData } from "@/lib/api/concentrators"
import { queryKeys } from "@/lib/helpers"
import { useActiveChainId } from "@/hooks/useActiveChainId"

export function useApiConcentratorStaticData() {
  const chainId = useActiveChainId()
  return {
    ...useQuery({
      ...queryKeys.concentrators.list({ chainId }),
      queryFn: () => getConcentratorStaticData({ chainId }),
      retry: false,
    }),
  }
}
