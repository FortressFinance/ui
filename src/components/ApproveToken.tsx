import React, { FC, useEffect } from "react"
import { BiInfinite } from "react-icons/bi"
import { Address } from "wagmi"
import { shallow } from "zustand/shallow"

import { useTokenApproval } from "@/hooks"

import Button from "@/components/Button"

import { useToastStore } from "@/store"

import { maxUint256 } from "@/constant"

type ApproveTokenProps = {
  amount: bigint
  approval: ReturnType<typeof useTokenApproval>
  disabled?: boolean
  spender: Address
}

export const ApproveToken: FC<ApproveTokenProps> = ({
  amount,
  approval,
  disabled = false,
  spender,
}) => {
  const [addToast, replaceToast] = useToastStore(
    (state) => [state.addToast, state.replaceToast],
    shallow
  )

  const [amountToApprove, setAmountToApprove] = React.useState<bigint | null>(
    null
  )

  const isApproving = approval.allowance.isLoading || approval.write.isLoading
  const isApprovingMin = isApproving && amountToApprove === amount
  const isApprovingMax = isApproving && amountToApprove === maxUint256

  const submitApproval = () => {
    if (!amountToApprove) return
    const action = "Token approval"
    const toastId = addToast({ type: "startTx", action })
    approval.write
      .writeAsync({ args: [spender, amountToApprove] })
      .then((receipt) =>
        replaceToast(toastId, { type: "waitTx", hash: receipt.hash, action })
      )
      .catch((error) => {
        replaceToast(toastId, { type: "errorWrite", error, action })
        setAmountToApprove(null)
      })
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
        onClick={() => setAmountToApprove(maxUint256)}
      >
        <span className="sr-only">Approve infinite</span>
        <BiInfinite className="h-5 w-5" />
      </Button>
    </div>
  )
}
