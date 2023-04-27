import { BigNumber } from "ethers"
import { parseUnits } from "ethers/lib/utils.js"
import { FC, useState } from "react"
import toast from "react-hot-toast"
import { Address, UserRejectedRequestError } from "wagmi"

import { addSlippage, assetToCollateral } from "@/lib"
import { formatCurrencyUnits } from "@/lib/helpers"
import {
  useRepayAssetWithCollateral,
  useTokenOrNative,
  useTokenOrNativeBalance,
} from "@/hooks"
import { useToast } from "@/hooks/useToast"

import Button from "@/components/Button"

type RepayAssetWithCollateralProps = {
  borrowAmountSignificant: BigNumber
  borrowAssetAddress?: Address
  collateralAmountSignificant: BigNumber
  collateralAssetBalance: ReturnType<typeof useTokenOrNativeBalance>
  collateralAssetAddress?: Address
  exchangeRate?: BigNumber
  exchangePrecision?: BigNumber
  pairAddress: Address
  onSuccess: () => void
}

export const RepayAssetWithCollateral: FC<RepayAssetWithCollateralProps> = ({
  borrowAmountSignificant,
  borrowAssetAddress,
  collateralAmountSignificant,
  collateralAssetBalance,
  collateralAssetAddress,
  exchangeRate,
  exchangePrecision,
  pairAddress,
  onSuccess,
}) => {
  const toastManager = useToast()

  const [repayCollateralAmount, setRepayCollateralAmount] =
    useState<string>("1")
  const repayCollateralAmountBig = parseUnits(
    repayCollateralAmount || "0",
    collateralAssetBalance.data?.decimals
  )
  const slippage = 0.000001

  const collateralAsset = useTokenOrNative({
    address: collateralAssetAddress,
  })

  const borrowedAmountDenominatedInCollateral = assetToCollateral(
    borrowAmountSignificant,
    exchangeRate,
    exchangePrecision
  )

  const repayAssetWithCollateral = useRepayAssetWithCollateral({
    borrowAssetAddress,
    collateralAmount: addSlippage(repayCollateralAmountBig, slippage),
    minAmount: repayCollateralAmountBig,
    enabled: collateralAmountSignificant.gt(0),
    pairAddress,
    onSuccess,
  })

  return (
    <div>
      <h1>Repay asset with collateral</h1>
      <div>
        Repay in full with collateral:{" "}
        {formatCurrencyUnits({
          amountWei: borrowedAmountDenominatedInCollateral?.toString(),
          decimals: collateralAsset.data?.decimals,
        })}{" "}
        fcGLP, with 1% buffer{" "}
        {formatCurrencyUnits({
          amountWei: addSlippage(
            borrowedAmountDenominatedInCollateral,
            slippage
          )?.toString(),
          decimals: collateralAsset.data?.decimals,
        })}{" "}
        fcGLP
      </div>{" "}
      <div className="flex gap-3">
        <input
          className="bg-dark p-3"
          type="text"
          value={repayCollateralAmount}
          onChange={(e) => setRepayCollateralAmount(e.target.value)}
        />
        <Button
          disabled={
            repayAssetWithCollateral.prepare.isError ||
            repayCollateralAmountBig.lte(0) ||
            collateralAmountSignificant.eq(BigNumber.from(0))
          }
          isLoading={
            repayAssetWithCollateral.prepare.isLoading ||
            repayAssetWithCollateral.write.isLoading ||
            repayAssetWithCollateral.wait.isLoading
          }
          onClick={() => {
            const waitingForSignature = toastManager.loading(
              "Waiting for signature..."
            )
            repayAssetWithCollateral.write
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
          Repay asset with collateral
          {repayAssetWithCollateral.prepare.isError ? " (error)" : ""}
        </Button>
      </div>
    </div>
  )
}
