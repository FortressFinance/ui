import toast from "react-hot-toast"
import { Address } from "wagmi"

import { ErrorToast, LoadingToast, SuccessToast } from "@/components/Toast"

const duration = 7000

export const useToast = () => ({
  loading: (message: string, txHash?: Address) =>
    toast.custom(
      (t) => (
        <LoadingToast
          isVisible={t.visible}
          message={message}
          txHash={txHash}
          onDismiss={() => toast.dismiss(t.id)}
        />
      ),
      { duration: Infinity }
    ),
  success: (message: string, txHash?: Address) =>
    toast.custom(
      (t) => (
        <SuccessToast
          isVisible={t.visible}
          message={message}
          txHash={txHash}
          onDismiss={() => toast.dismiss(t.id)}
        />
      ),
      { duration }
    ),
  error: (message: string, txHash?: Address) =>
    toast.custom(
      (t) => (
        <ErrorToast
          isVisible={t.visible}
          message={message}
          txHash={txHash}
          onDismiss={() => toast.dismiss(t.id)}
        />
      ),
      { duration }
    ),
})
