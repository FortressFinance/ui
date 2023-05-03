import { BigNumber, ethers } from "ethers"
import { parseUnits } from "ethers/lib/utils"
import { FC, useState } from "react"
import toast from "react-hot-toast"
import { Address, UserRejectedRequestError } from "wagmi"

import { addSlippage } from "@/lib"
import { formatCurrencyUnits } from "@/lib/helpers"
import {
  useConvertToShares,
  useRepayAsset,
  useTokenApproval,
  useTokenOrNative,
  useTokenOrNativeBalance,
} from "@/hooks"
import { useToast } from "@/hooks/useToast"

import Button from "@/components/Button"

type RepayAssetProps = {
  borrowAmountSignificant: BigNumber
  borrowAssetAddress?: Address
  borrowAssetBalance: ReturnType<typeof useTokenOrNativeBalance>
  totalBorrowAmount?: BigNumber
  totalBorrowShares?: BigNumber
  pairAddress: Address
  onSuccess: () => void
}
export const RepayAsset: FC<RepayAssetProps> = ({
  borrowAmountSignificant,
  borrowAssetAddress,
  borrowAssetBalance,
  totalBorrowAmount,
  totalBorrowShares,
  pairAddress,
  onSuccess,
}) => {
  const toastManager = useToast()

  const [repayAssetAmount, setRepayAssetAmount] = useState<string>("1")
  const repayAssetAmountBig = parseUnits(
    repayAssetAmount || "0",
    borrowAssetBalance.data?.decimals
  )
  const slippage = 0.000001

  const borrowAsset = useTokenOrNative({
    address: borrowAssetAddress,
  })

  const approval = useTokenApproval({
    amount: ethers.constants.MaxUint256,
    spender: pairAddress,
    token: borrowAssetAddress,
    enabled: repayAssetAmountBig.gt(0),
  })
  const sharesToRepay = useConvertToShares({
    amount: repayAssetAmountBig,
    totalBorrowAmount,
    totalBorrowShares,
    pairAddress,
  })
  const repayAsset = useRepayAsset({
    shares: sharesToRepay.data,
    enabled: approval.isSufficient,
    pairAddress,
    onSuccess,
  })

  return (
    <div>
      <h1>Repay asset</h1>
      <div>
        Repay in full:{" "}
        {formatCurrencyUnits({
          amountWei: borrowAmountSignificant?.toString(),
          decimals: borrowAsset.data?.decimals,
        })}{" "}
        FRAX, with 1% buffer{" "}
        {formatCurrencyUnits({
          amountWei: addSlippage(borrowAmountSignificant, slippage)?.toString(),
          decimals: borrowAsset.data?.decimals,
        })}{" "}
        FRAX
      </div>
      <div className="flex gap-3">
        <input
          className="bg-dark p-3"
          type="text"
          value={repayAssetAmount}
          onChange={(e) => setRepayAssetAmount(e.target.value)}
        />
        <Button
          isLoading={
            approval.prepare.isLoading ||
            approval.write.isLoading ||
            approval.wait.isLoading
          }
          disabled={approval.isSufficient || borrowAmountSignificant.eq(0)}
          onClick={() => {
            const waitingForSignature = toastManager.loading(
              "Waiting for signature..."
            )
            approval.write
              .writeAsync?.()
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
          }}
        >
          Approve
        </Button>
        <Button
          disabled={
            repayAsset.prepare.isError ||
            !approval.isSufficient ||
            borrowAmountSignificant.eq(BigNumber.from(0))
          }
          isLoading={
            sharesToRepay.isLoading ||
            repayAsset.prepare.isLoading ||
            repayAsset.write.isLoading ||
            repayAsset.wait.isLoading
          }
          onClick={() => {
            const waitingForSignature = toastManager.loading(
              "Waiting for signature..."
            )
            repayAsset.write
              .writeAsync?.()
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
          }}
        >
          Repay asset
          {repayAsset.prepare.isError ? " (error)" : ""}
        </Button>
      </div>
    </div>
  )
}
