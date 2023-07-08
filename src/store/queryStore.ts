import { UseQueryResult } from "@tanstack/react-query"
import { create } from "zustand"

type QueryStore = {
  queryStatus: Set<string>
  queryQueue: Map<string, UseQueryResult<unknown, unknown>>
  addFailedStatus: (key: string) => void
  addQueryInprogress: (
    key: string,
    promise: UseQueryResult<unknown, unknown>
  ) => void
}

// Create a Zustand store to hold only the failed request
export const useQueryStatusStore = create<QueryStore>((set) => ({
  queryStatus: new Set<string>(),
  queryQueue: new Map<string, UseQueryResult<unknown, unknown>>(),
  addFailedStatus: (key) => {
    set((state) => ({ queryStatus: state.queryStatus.add(key) }))
  },
  addQueryInprogress: (key, promise) => {
    set((state) => ({ queryQueue: state.queryQueue.set(key, promise) }))
  },
}))
