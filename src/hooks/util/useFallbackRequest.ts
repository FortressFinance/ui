/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  QueryObserverBaseResult,
  QueryObserverResult,
} from "@tanstack/react-query"
import type { ReadContractResult, ReadContractsResult } from "@wagmi/core"
import type { Abi } from "abitype"
import {
  useContractRead,
  UseContractReadConfig,
  useContractReads,
  UseContractReadsConfig,
} from "wagmi"

export type UseWagmiQueryResult<TData, TError> = Pick<
  QueryObserverResult<TData, TError>,
  | "data"
  | "error"
  | "fetchStatus"
  | "isError"
  | "isFetched"
  | "isFetchedAfterMount"
  | "isFetching"
  | "isLoading"
  | "isRefetching"
  | "isSuccess"
  | "refetch"
> & {
  isIdle: boolean
  status: "idle" | "loading" | "success" | "error"
  internal: Pick<
    QueryObserverResult,
    | "dataUpdatedAt"
    | "errorUpdatedAt"
    | "failureCount"
    | "isLoadingError"
    | "isPaused"
    | "isPlaceholderData"
    | "isPreviousData"
    | "isRefetchError"
    | "isStale"
    | "remove"
  >
}

export function useFallbackRead<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends string,
  TSelectData = ReadContractResult<TAbi, TFunctionName>
>(
  {
    enabled = true,
    ...contractReadConfig
  }: UseContractReadConfig<TAbi, TFunctionName, TSelectData> = {} as any,
  preferredRequests: QueryObserverBaseResult[]
) {
  const fallbackEnabled = preferredRequests.length
    ? preferredRequests.some((q) => q.isError)
    : true
  return useContractRead<TAbi, TFunctionName, TSelectData>({
    ...(contractReadConfig as any),
    enabled: enabled && fallbackEnabled,
  })
}

export function useFallbackReads<
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends string,
  TContracts extends {
    abi: TAbi
    functionName: TFunctionName
  }[],
  TSelectData = ReadContractsResult<TContracts>
>(
  {
    enabled = true,
    ...contractReadsConfig
  }: UseContractReadsConfig<TContracts, TSelectData> = {} as any,
  preferredRequests: QueryObserverBaseResult[]
  // Need explicit type annotation so TypeScript doesn't expand return type into recursive conditional
): UseWagmiQueryResult<TSelectData, Error> {
  const fallbackEnabled = preferredRequests.length
    ? preferredRequests.some((q) => q.isError)
    : true
  return useContractReads<TAbi, TFunctionName, TContracts, TSelectData>({
    ...contractReadsConfig,
    enabled: enabled && fallbackEnabled,
  })
}
