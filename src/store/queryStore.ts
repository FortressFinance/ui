import { create } from "zustand"

type QueryStore = {
  queryStatus: Set<string>
  addFailedStatus: (key: string) => void
}

// Create a Zustand store to hold only the failed request
export const useQueryStatusStore = create<QueryStore>((set) => ({
  queryStatus: new Set<string>(),
  addFailedStatus: (key) => {
    set((state) => ({ queryStatus: state.queryStatus.add(key) }))
  },
}))
