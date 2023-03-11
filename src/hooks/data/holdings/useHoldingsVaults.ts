import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { Address, useAccount } from "wagmi"

import { handledResponse } from "@/lib/api/util"
import { fortressApi } from "@/lib/api/util/fortressApi"
import { queryKeys } from "@/lib/helpers"
import useActiveChainId from "@/hooks/useActiveChainId"

export function useHoldingsVaults() {
  const { address: userAddress } = useAccount()
  const chainId = useActiveChainId()

  return useQuery({
    ...queryKeys.holdings.list({ chainId, user: userAddress }),
    queryFn: () => getUserVaults({ chainId, user: userAddress }),
    retry: false
  })
}

export function useInvalidateHoldingsVaults({
  enabled, 
}: {
  enabled: boolean
}) {
  const { address: userAddress } = useAccount()
  const chainId = useActiveChainId()
  // Get QueryClient from the context  
  const queryClient = useQueryClient()

  useEffect(() => {
    const holdingsKey = queryKeys.holdings.list({ chainId, user: userAddress }).queryKey
    if(enabled){
      queryClient.invalidateQueries({ queryKey: holdingsKey })
    }
  }, [chainId, enabled, queryClient, userAddress])
}



type UserVault = {
  vaults: Address[]
}

async function getUserVaults({
  chainId,
  user = "0x",
}: {
  chainId: number
  user: Address | undefined
}) {
  const resp = await fortressApi.post<UserVault>(
    "protocol/get_user_vaults",
    { chainId, user }
  )
  return handledResponse(resp?.data?.data)
}
