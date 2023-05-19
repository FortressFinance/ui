import { QueryFunctionContext, UseQueryOptions } from "@tanstack/react-query"
import {
  Address,
  FetchEnsNameArgs,
  FetchEnsNameResult,
  getPublicClient,
} from "@wagmi/core"
import { getAddress } from "viem"
import { useQuery } from "wagmi"

// ? custom, mainnet ens lookup; adapted from:
// * @wagmi/core/src/actions/ens/fetchEnsName.ts
// * @wagmi/react/src/hooks/ens/useEnsName.ts

type QueryConfig<Data, Error> = Pick<
  UseQueryOptions<Data, Error>,
  "onError" | "onSettled" | "onSuccess"
>
type UseMainnetEnsNameArgs = Partial<FetchEnsNameArgs>
type UseEnsNameConfig = QueryConfig<FetchEnsNameResult, Error>

export function useMainnetEnsName({
  address,
  onError,
  onSettled,
  onSuccess,
}: UseMainnetEnsNameArgs & UseEnsNameConfig = {}) {
  const chainId = 1

  return useQuery(queryKey({ address, chainId }), queryFn, {
    enabled: Boolean(address),
    staleTime: 1_000 * 60 * 60 * 24, // 24 hours
    suspense: false,
    onError,
    onSettled,
    onSuccess,
  })
}

const queryKey = ({
  address,
  chainId,
}: {
  address?: Address
  chainId?: number
}) => [{ entity: "ensName", address, chainId }] as const

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type QueryFunctionArgs<T extends (...args: any) => any> = QueryFunctionContext<
  ReturnType<T>
>

const queryFn = ({
  queryKey: [{ address }],
}: QueryFunctionArgs<typeof queryKey>) => {
  if (!address) throw new Error("address is required")
  return fetchMainnetEnsName({ address })
}

type FetchMainnetEnsNameResult = string | null

async function fetchMainnetEnsName({
  address,
}: {
  address: Address | undefined
}): Promise<FetchMainnetEnsNameResult> {
  if (!address) throw new Error("address is required")
  const publicClient = getPublicClient({ chainId: 1 })
  return publicClient.getEnsName({ address: getAddress(address) })
}
