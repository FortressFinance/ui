import { useQuery } from "@tanstack/react-query"
import { shallow } from "zustand/shallow"

import { useQueryStatusStore } from "@/store"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useQueryWithStatus(arg: any) {
  const requestStatus = useQueryStatusStore((state) => state.queryStatus)
  const requestInprogress = useQueryStatusStore((state) => state.queryQueue)

  const queryKey = JSON.stringify(arg?.queryKey)
  const isPreviousFailed = requestStatus.has(queryKey)
  const queryStillInprogress = requestInprogress.has(queryKey)

  const isEnabled = !isPreviousFailed && arg?.enabled && !queryStillInprogress

  const [addFailedStatus, addQueryInprogress] = useQueryStatusStore(
    (state) => [state.addFailedStatus, state.addQueryInprogress],
    shallow
  )

  // Execute the query using useQuery
  const query = useQuery({
    ...arg,
    enabled: isEnabled,
  })

  // Check if the request has failed previously
  if (isPreviousFailed) {
    return {
      isError: true,
      error: new Error("Previous request failed."),
      isSuccess: false,
      isFetched: false,
      isLoading: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: undefined as any,
    }
  }

  // Check if the request is already in progress
  if (queryStillInprogress) {
    return (
      requestInprogress.get(queryKey) ?? {
        isError: true,
        error: new Error("Previous request failed."),
        isSuccess: false,
        isFetched: false,
        isLoading: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: undefined as any,
      }
    )
  }

  // If the request is in progress, store the promise in the queue
  if (isEnabled) {
    addQueryInprogress(queryKey, query)
  }

  // Store the request status after it's completed
  if (isEnabled && !query.isSuccess) {
    addFailedStatus(queryKey)
    requestInprogress.delete(queryKey)
  }

  return query
}
