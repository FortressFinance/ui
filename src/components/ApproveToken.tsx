import { BigNumber, ethers } from "ethers"
import React, { FC, useEffect } from "react"
import toast from "react-hot-toast"
import { BiInfinite } from "react-icons/bi"
import { UserRejectedRequestError } from "wagmi"

import { useTokenApproval } from "@/hooks"
import { useToast } from "@/hooks/useToast"

import Button from "@/components/Button"

type ApproveTokenProps = {
  amount: BigNumber
  approval: ReturnType<typeof useTokenApproval>
  disabled: boolean
}

export const ApproveToken: FC<ApproveTokenProps> = ({
  amount,
  approval,
  disabled,
}) => {
  const toastManager = useToast()
  const [amountToApprove, setAmountToApprove] =
    React.useState<BigNumber | null>(null)

  const isApproving = approval.allowance.isLoading || approval.write.isLoading
  const isApprovingMin = isApproving && amountToApprove?.eq(amount)
  const isApprovingMax =
    isApproving && amountToApprove?.eq(ethers.constants.MaxUint256)

  const submitApproval = () => {
    if (!amountToApprove) return
    const waitingForSignature = toastManager.loading("Waiting for signature...")
    approval.write
      .writeAsync()
      .then((receipt) =>
        toastManager.loading(
          "Waiting for transaction confirmation...",
          receipt.hash
        )
      )
      .catch((err) =>
        toastManager.error(
          err instanceof UserRejectedRequestError
            ? "User rejected request"
            : "Error broadcasting transaction"
        )
      )
      .finally(() => toast.dismiss(waitingForSignature))
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(submitApproval, [amountToApprove])

  return (
    <div className="flex w-full gap-1.5">
      <Button
        type="button"
        className="w-full"
        disabled={disabled || isApprovingMax}
        isLoading={isApprovingMin}
        onClick={() => setAmountToApprove(amount)}
      >
        Approve
      </Button>
      <Button
        type="button"
        className="shrink-0"
        disabled={disabled || isApprovingMin}
        isLoading={isApprovingMax}
        onClick={() => setAmountToApprove(ethers.constants.MaxUint256)}
      >
        <span className="sr-only">Approve infinite</span>
        <BiInfinite className="h-5 w-5" />
      </Button>
    </div>
  )
}
