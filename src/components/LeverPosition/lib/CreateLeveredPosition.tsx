import * as Slider from "@radix-ui/react-slider"
import { BigNumber, ethers } from "ethers"
import { parseUnits } from "ethers/lib/utils.js"
import { FC, useState } from "react"
import toast from "react-hot-toast"
import { Address, UserRejectedRequestError } from "wagmi"

import {
  calculateLTV,
  calculateMaxLeverage,
  leverageMultiplier,
  ltvPercentage,
} from "@/lib"
import { formatCurrencyUnits } from "@/lib/helpers"
import {
  useLeverPosition,
  useTokenApproval,
  useTokenOrNativeBalance,
} from "@/hooks"
import useDebounce from "@/hooks/useDebounce"
import { useToast } from "@/hooks/useToast"

import Button from "@/components/Button"

type CreateLeveredPositionProps = {
  borrowAssetAddress?: Address
  collateralAssetBalance: ReturnType<typeof useTokenOrNativeBalance>
  collateralAssetAddress?: Address
  exchangeRate?: BigNumber
  exchangePrecision?: BigNumber
  ltvPrecision?: BigNumber
  maxLTV?: BigNumber
  pairAddress: Address
  onSuccess: () => void
}

export const CreateLeveredPosition: FC<CreateLeveredPositionProps> = ({
  borrowAssetAddress,
  collateralAssetBalance,
  collateralAssetAddress,
  exchangeRate,
  exchangePrecision,
  ltvPrecision,
  maxLTV,
  pairAddress,
  onSuccess,
}) => {
  const toastManager = useToast()

  const maxLeverage = calculateMaxLeverage({
    maxLTV,
    ltvPrecision,
  })

  const [collateralAmount, setCollateralAmount] = useState<string>("1")
  const [leverAmount, setLeverAmount] = useState(1)

  const collateralAmountBig = parseUnits(
    collateralAmount,
    collateralAssetBalance.data?.decimals
  )
  const leveredBalance = collateralAmountBig
    .mul(BigNumber.from(Math.floor(leverAmount * 100)))
    .div(100)
  const leveredBorrowAmount = leveredBalance?.sub(collateralAmountBig)
  const leveredBorrowAmountDebounced = useDebounce(leveredBorrowAmount, 1000)
  const leveredLTV = calculateLTV({
    borrowedAmount: leveredBorrowAmount,
    collateralAmount: leveredBalance,
    exchangeRate,
    exchangePrecision,
    ltvPrecision,
  })

  const approval = useTokenApproval({
    amount: ethers.constants.MaxUint256,
    spender: pairAddress,
    token: collateralAssetAddress,
    enabled: leverAmount > 1,
  })
  const leverPosition = useLeverPosition({
    borrowAmount: leveredBorrowAmountDebounced,
    borrowAssetAddress,
    collateralAmount: collateralAmountBig,
    minAmount: BigNumber.from(1),
    enabled: leverAmount > 1 && approval.isSufficient,
    pairAddress,
    onSuccess,
  })

  return (
    <div className="grid grid-cols-[max-content,max-content,1fr,1fr] items-center gap-6">
      <input
        className="bg-dark p-3"
        type="text"
        value={collateralAmount}
        onChange={(e) => setCollateralAmount(e.target.value)}
      />
      <Slider.Root
        min={1}
        max={maxLeverage}
        step={0.01}
        className="relative flex h-5 w-[200px] touch-none select-none items-center"
        onValueChange={([value]) => setLeverAmount(value)}
      >
        <Slider.Track className="relative h-[3px] grow rounded-full bg-orange/25">
          <Slider.Range className="absolute h-full rounded-full bg-gradient-to-r from-orange to-pink" />
        </Slider.Track>
        <Slider.Thumb className="hover:bg-violet3 focus:shadow-blackA8 block h-5 w-5 rounded-[10px] bg-white focus:outline-none focus:ring-4 focus:ring-white/25" />
      </Slider.Root>
      <div className="font-mono">
        <div>
          LEV: {leverageMultiplier(1)}{" "}
          {leverAmount > 1 && (
            <span className="text-green-300">
              &rarr; {leverageMultiplier(leverAmount)}
            </span>
          )}
        </div>
        <div>
          LTV: {ltvPercentage(BigNumber.from(1), ltvPrecision)}{" "}
          {leverAmount > 1 && (
            <span className="text-green-300">
              &rarr; {ltvPercentage(leveredLTV, ltvPrecision)}
            </span>
          )}
        </div>
        <div>
          AMT:{" "}
          {formatCurrencyUnits({
            abbreviate: true,
            amountWei: collateralAssetBalance.data?.value?.toString(),
            decimals: collateralAssetBalance.data?.decimals,
          })}{" "}
          {collateralAssetBalance.data?.symbol}{" "}
          {leverAmount > 1 && (
            <span className="text-green-300">
              &rarr;{" "}
              {formatCurrencyUnits({
                abbreviate: true,
                amountWei: leveredBalance?.toString(),
                decimals: collateralAssetBalance.data?.decimals,
              })}{" "}
              {collateralAssetBalance.data?.symbol}
            </span>
          )}
        </div>
      </div>
      <div className="flex gap-3">
        <Button
          className="w-full"
          isLoading={
            approval.prepare.isLoading ||
            approval.write.isLoading ||
            approval.wait.isLoading
          }
          disabled={approval.isSufficient || leverAmount === 1}
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
          className="w-full"
          isLoading={
            leverPosition.prepare.isLoading ||
            leverPosition.write.isLoading ||
            leverPosition.wait.isLoading
          }
          disabled={
            !approval.isSufficient ||
            leverAmount === 1 ||
            !leveredBorrowAmount?.eq(
              leveredBorrowAmountDebounced ?? BigNumber.from(0)
            ) ||
            leveredBorrowAmountDebounced?.eq(
              leveredBalance ?? BigNumber.from(0)
            )
          }
          onClick={() => {
            const waitingForSignature = toastManager.loading(
              "Waiting for signature..."
            )
            leverPosition.write
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
          Lever
          {leverPosition.prepare.isError ? " (error)" : ""}
        </Button>
      </div>
    </div>
  )
}
