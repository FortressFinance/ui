import { ethers } from "ethers"
import { parseUnits } from "ethers/lib/utils.js"
import { FC, useState } from "react"
import toast from "react-hot-toast"
import { Address, UserRejectedRequestError } from "wagmi"

import {
  useAddCollateral,
  useTokenApproval,
  useTokenOrNativeBalance,
} from "@/hooks"
import { useToast } from "@/hooks/useToast"

import Button from "@/components/Button"

type AddCollateralProps = {
  collateralAssetBalance: ReturnType<typeof useTokenOrNativeBalance>
  collateralAssetAddress?: Address
  pairAddress: Address
  onSuccess: () => void
}

export const AddCollateral: FC<AddCollateralProps> = ({
  collateralAssetBalance,
  collateralAssetAddress,
  pairAddress,
  onSuccess,
}) => {
  const toastManager = useToast()

  const [collateralAmount, setCollateralAmount] = useState<string>("1")
  const collateralAmountBig = parseUnits(
    collateralAmount || "0",
    collateralAssetBalance.data?.decimals
  )

  const approval = useTokenApproval({
    amount: ethers.constants.MaxUint256,
    spender: pairAddress,
    token: collateralAssetAddress,
    enabled: collateralAmountBig.gt(0),
  })
  const addCollateral = useAddCollateral({
    collateralAmount: collateralAmountBig,
    enabled: collateralAssetBalance.data?.value.gt(0),
    pairAddress,
    onSuccess,
  })

  return (
    <div>
      <h1>Add collateral</h1>
      <div>
        Collateral available: {collateralAssetBalance.data?.formatted} fcGLP
      </div>
      <div className="flex gap-3">
        <input
          className="bg-dark p-3"
          type="text"
          value={collateralAmount}
          onChange={(e) => setCollateralAmount(e.target.value)}
        />
        <Button
          isLoading={
            approval.prepare.isLoading ||
            approval.write.isLoading ||
            approval.wait.isLoading
          }
          disabled={approval.isSufficient || collateralAmountBig.eq(0)}
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
            addCollateral.prepare.isError ||
            !approval.isSufficient ||
            collateralAmountBig.lte(0)
          }
          isLoading={
            addCollateral.prepare.isLoading ||
            addCollateral.write.isLoading ||
            addCollateral.wait.isLoading
          }
          onClick={() => {
            const waitingForSignature = toastManager.loading(
              "Waiting for signature..."
            )
            addCollateral.write
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
          Add collateral
          {addCollateral.prepare.isError ? " (error)" : ""}
        </Button>
      </div>
    </div>
  )
}
