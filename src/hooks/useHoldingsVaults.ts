import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Address, useAccount } from "wagmi"

import { handledResponse } from "@/lib/api/util"
import { fortressApi } from "@/lib/api/util/fortressApi"
import { queryKeys } from "@/lib/helpers"
import { useActiveChainId } from "@/hooks"

export function useHoldingsVaults({ isCompounder }: { isCompounder: boolean }) {
  const { address: userAddress } = useAccount()
  const chainId = useActiveChainId()

  return useQuery({
    ...queryKeys.holdings.list({ chainId, user: userAddress }),
    queryFn: () => getUserVaults({ chainId, user: userAddress, isCompounder }),
    retry: false,
  })
}

export function useInvalidateHoldingsVaults() {
  const { address: userAddress } = useAccount()
  const chainId = useActiveChainId()
  // Get QueryClient from the context
  const queryClient = useQueryClient()

  const holdingsKey = queryKeys.holdings.list({
    chainId,
    user: userAddress,
  }).queryKey

  const invalidateHoldingsVaults = () => {
    queryClient.invalidateQueries({ queryKey: holdingsKey })
  }
  return invalidateHoldingsVaults
}

type UserVault = {
  vaults: Address[]
}

async function getUserVaults({
  chainId,
  user = "0x",
  isCompounder,
}: {
  chainId: number
  user?: Address
  isCompounder: boolean
}) {
  const resp = await fortressApi.post<UserVault>("Protocol/get_user_vaults", {
    chainId,
    isCompounder,
    user,
  })
  return handledResponse(resp?.data?.data)
}
