import { QueryFunctionContext, UseQueryOptions } from "@tanstack/react-query"
import { Address } from "@wagmi/core"
import { createPublicClient, getAddress, http, parseAbiItem } from "viem"
import { arbitrum } from "viem/chains"
import { useQuery } from "wagmi"

import { useActiveChainId } from "@/hooks/useActiveChainId"

type QueryConfig<Data, Error> = Pick<
  UseQueryOptions<Data, Error>,
  "onError" | "onSettled" | "onSuccess"
>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UseArbitrumLogsArgs = Partial<any>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UseLogConfig = QueryConfig<any, Error>

export function useArbitrumDepositLogs({
  address,
  onError,
  onSettled,
  onSuccess,
}: UseArbitrumLogsArgs & UseLogConfig = {}) {
  const chainId = useActiveChainId()

  return useQuery(
    queryKey({ address, chainId, event: "deposit" }),
    queryFnDeposit,
    {
      enabled: Boolean(address),
      //staleTime: 1_000 * 60 * 60 * 3, // 3 hours
      suspense: false,
      onError,
      onSettled,
      onSuccess,
    }
  )
}

export function useArbitrumWithdrawLogs({
  address,
  onError,
  onSettled,
  onSuccess,
}: UseArbitrumLogsArgs & UseLogConfig = {}) {
  const chainId = useActiveChainId()

  return useQuery(
    queryKey({ address, chainId, event: "withdraw" }),
    queryFnWithdraw,
    {
      enabled: Boolean(address),
      //staleTime: 1_000 * 60 * 60 * 3, // 3 hours
      suspense: false,
      onError,
      onSettled,
      onSuccess,
    }
  )
}

export function useArbitrumTransferLogs({
  address,
  onError,
  onSettled,
  onSuccess,
}: UseArbitrumLogsArgs & UseLogConfig = {}) {
  const chainId = useActiveChainId()

  return useQuery(
    queryKey({ address, chainId, event: "transfer" }),
    queryFnTransfer,
    {
      enabled: Boolean(address),
      //staleTime: 1_000 * 60 * 60 * 3, // 3 hours
      suspense: false,
      onError,
      onSettled,
      onSuccess,
    }
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type QueryFunctionArgs<T extends (...args: any) => any> = QueryFunctionContext<
  ReturnType<T>
>

const queryKey = ({
  address,
  chainId,
  event,
}: {
  address?: Address
  chainId?: number
  event?: string
}) => [{ entity: "getLogs", address, chainId, event }] as const

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const queryFnDeposit = ({
  queryKey: [{ address }],
}: QueryFunctionArgs<typeof queryKey>) => {
  if (!address) throw new Error("address is required")
  return fetchLogDeposit({ address })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const queryFnWithdraw = ({
  queryKey: [{ address }],
}: QueryFunctionArgs<typeof queryKey>) => {
  if (!address) throw new Error("address is required")
  return fetchLogWithdraw({ address })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const queryFnTransfer = ({
  queryKey: [{ address }],
}: QueryFunctionArgs<typeof queryKey>) => {
  if (!address) throw new Error("address is required")
  return fetchLogTransfer({ address })
}

async function fetchLogDeposit({
  address,
}: {
  address?: Address
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}): Promise<any> {
  if (!address) throw new Error("address is required")
  const client = createPublicClient({
    chain: arbitrum,
    transport: http(
      `https://arb-mainnet.g.alchemy.com/v2/-wP78W37FcrusMohOijQj9EeuXFKX6ZV`
    ),
  })

  return await client.getLogs({
    address: getAddress(address),
    fromBlock: 0n,
    event: parseAbiItem(
      "event Deposit(address indexed _caller, address indexed _receiver, uint256 _assets, uint256 _shares)"
    ),
  })
}

async function fetchLogWithdraw({
  address,
}: {
  address?: Address
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}): Promise<any> {
  if (!address) throw new Error("address is required")
  const client = createPublicClient({
    chain: arbitrum,
    transport: http(
      `https://arb-mainnet.g.alchemy.com/v2/-wP78W37FcrusMohOijQj9EeuXFKX6ZV`
    ),
  })

  return await client.getLogs({
    address: getAddress(address),
    fromBlock: 0n,
    event: parseAbiItem(
      "event Withdraw(address indexed _caller, address indexed _receiver, address indexed _owner, uint256 _assets, uint256 _shares)"
    ),
  })
}

async function fetchLogTransfer({
  address,
}: {
  address?: Address
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}): Promise<any> {
  if (!address) throw new Error("address is required")
  const client = createPublicClient({
    chain: arbitrum,
    transport: http(
      `https://arb-mainnet.g.alchemy.com/v2/-wP78W37FcrusMohOijQj9EeuXFKX6ZV`
    ),
  })

  return await client.getLogs({
    address: getAddress(address),
    fromBlock: 0n,
    event: parseAbiItem(
      "event YbTokenTransfer(address indexed _caller, address indexed _receiver, uint256 _assets, uint256 _shares)"
    ),
  })
}
