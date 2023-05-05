import { ethers } from "ethers"
import { parseUnits } from "ethers/lib/utils.js"
import { FC, useState } from "react"
import { Address } from "wagmi"
import { shallow } from "zustand/shallow"

import {
  useAddCollateral,
  useTokenApproval,
  useTokenOrNativeBalance,
} from "@/hooks"

import Button from "@/components/Button"

import { useToastStore } from "@/store"

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
  const [addToast, replaceToast] = useToastStore(
    (state) => [state.addToast, state.replaceToast],
    shallow
  )

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
          isLoading={approval.write.isLoading || approval.wait.isLoading}
          disabled={approval.isSufficient || collateralAmountBig.eq(0)}
          onClick={() => {
            const action = "Token approval"
            const toastId = addToast({ type: "startTx", action })
            approval.write
              .writeAsync?.()
              .then((receipt) =>
                replaceToast(toastId, {
                  type: "waitTx",
                  action,
                  hash: receipt.hash,
                })
              )
              .catch((error) =>
                replaceToast(toastId, { type: "errorWrite", action, error })
              )
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
            const action = "Collateral deposit"
            const toastId = addToast({ type: "startTx", action })
            addCollateral.write
              .writeAsync?.()
              .then((receipt) =>
                replaceToast(toastId, {
                  type: "waitTx",
                  action,
                  hash: receipt.hash,
                })
              )
              .catch((error) =>
                replaceToast(toastId, { type: "errorWrite", action, error })
              )
          }}
        >
          Add collateral
          {addCollateral.prepare.isError ? " (error)" : ""}
        </Button>
      </div>
    </div>
  )
}
