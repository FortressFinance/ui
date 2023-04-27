import { BigNumber } from "ethers"
import { parseUnits } from "ethers/lib/utils"
import { FC, useState } from "react"
import toast from "react-hot-toast"
import { Address, UserRejectedRequestError } from "wagmi"

import { formatCurrencyUnits } from "@/lib/helpers"
import { useRemoveCollateral, useTokenOrNativeBalance } from "@/hooks"
import { useToast } from "@/hooks/useToast"

import Button from "@/components/Button"

type RemoveCollateralProps = {
  collateralAmountSignificant: BigNumber
  collateralAssetBalance: ReturnType<typeof useTokenOrNativeBalance>
  collateralAssetAddress?: Address
  pairAddress: Address
  onSuccess: () => void
}

export const RemoveCollateral: FC<RemoveCollateralProps> = ({
  collateralAmountSignificant,
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

  const removeCollateral = useRemoveCollateral({
    collateralAmount: collateralAmountBig,
    collateralAssetAddress,
    enabled: collateralAmountSignificant.gt(0),
    pairAddress,
    onSuccess,
  })

  return (
    <div>
      <h1>Remove collateral</h1>
      <div>
        Collateral available:{" "}
        {formatCurrencyUnits({
          amountWei: collateralAmountSignificant?.toString(),
          decimals: collateralAssetBalance.data?.decimals,
        })}{" "}
        fcGLP
      </div>
      <div className="flex gap-3">
        <input
          className="bg-dark p-3"
          type="text"
          value={collateralAmount}
          onChange={(e) => setCollateralAmount(e.target.value)}
        />
        <Button
          disabled={
            removeCollateral.prepare.isError ||
            collateralAmountBig.lte(BigNumber.from(0))
          }
          isLoading={
            removeCollateral.prepare.isLoading ||
            removeCollateral.write.isLoading ||
            removeCollateral.wait.isLoading
          }
          onClick={() => {
            const waitingForSignature = toastManager.loading(
              "Waiting for signature..."
            )
            removeCollateral.write
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
          Remove collateral
          {removeCollateral.prepare.isError ? " (error)" : ""}
        </Button>
      </div>
    </div>
  )
}
