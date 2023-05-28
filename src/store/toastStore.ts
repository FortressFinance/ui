import { uniqueId } from "lodash"
import { Address } from "wagmi"
import { create } from "zustand"

type ToastInfo =
  | { type: "errorSpeedBump"; action?: string }
  | { type: "errorTx"; action?: string; hash?: string }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | { type: "errorWrite"; action?: string; error: any }
  | { type: "startTx"; action?: string }
  | { type: "successTx"; action?: string; hash: string }
  | { type: "waitTx"; action?: string; hash: Address }

export type Toast = { id: string } & ToastInfo

type ToastStore = {
  toasts: Array<Toast & { id: string }>
  addToast: (toast: ToastInfo) => string
  dismissToast: (id: string) => void
  replaceToast: (id: string, toast: ToastInfo) => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = uniqueId()
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }))
    return id
  },
  dismissToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
  replaceToast: (id, toast) =>
    set((state) => ({
      toasts: state.toasts.map((t) => (t.id === id ? { ...toast, id } : t)),
    })),
}))
