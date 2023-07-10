import {
  QueryKey,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query"
import { shallow } from "zustand/shallow"

import { useQueryStatusStore } from "@/store"

export function useQueryWithStatus<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  options: Omit<
    UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    "initialData"
  > & { initialData?: () => undefined }
): UseQueryResult<TData, TError> {
  const [addFailedStatus, failedQueries] = useQueryStatusStore(
    (state) => [state.addFailedStatus, state.queryStatus],
    shallow
  )

  const queryKey = JSON.stringify(options?.queryKey)
  const isPreviousFailed = failedQueries.has(queryKey)

  const isEnabled = !isPreviousFailed && options?.enabled

  // Execute the query using useQuery
  const query = useQuery({
    ...options,
    enabled: isEnabled,
  })

  // Check if the request has failed previously
  if (isPreviousFailed) {
    return {
      isError: true,
      error: new Error("Previous request failed.") as unknown as TError,
      isSuccess: false,
      isFetching: false,
      isLoading: false,
      data: undefined,
    } as UseQueryResult<TData, TError>
  }

  // Store the request status after it's completed
  if (isEnabled && query.isError) {
    addFailedStatus(queryKey)
  }

  return query
}
