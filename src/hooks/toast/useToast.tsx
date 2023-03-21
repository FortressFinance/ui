import toast from "react-hot-toast"

import { ErrorToast, LoadingToast, SuccessToast } from "@/components/Toast"

//const duration = 7000
const position = "top-right"

export const useToast = () => ({
  loading: (message: string) =>
    toast.custom(
      (t) => <LoadingToast isVisible={t.visible} message={message} />,
      { duration: Infinity, position }
    ),
  success: (message: string, txHash: string) =>
    toast.custom(
      (t) => (
        <SuccessToast isVisible={t.visible} message={message} txHash={txHash} />
      ),
      { duration: Infinity, position }
    ),
  error: (message: string, txHash: string) =>
    toast.custom(
      (t) => (
        <ErrorToast isVisible={t.visible} message={message} txHash={txHash} />
      ),
      { duration: Infinity, position }
    ),
})
