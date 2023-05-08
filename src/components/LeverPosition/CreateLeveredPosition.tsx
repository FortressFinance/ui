import * as Slider from "@radix-ui/react-slider"
import { BigNumber, ethers } from "ethers"
import { parseUnits } from "ethers/lib/utils.js"
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react"
import { useDebounce } from "react-use"
import { Address } from "wagmi"
import { shallow } from "zustand/shallow"

import { calculateMaxLeverage } from "@/lib"
import {
  useLeverPosition,
  useTokenApproval,
  useTokenOrNativeBalance,
} from "@/hooks"

import Button from "@/components/Button"

import { useToastStore } from "@/store"

type CreateLeveredPositionProps = {
  borrowAssetAddress?: Address
  collateralAssetBalance: ReturnType<typeof useTokenOrNativeBalance>
  collateralAssetAddress?: Address
  ltvPrecision?: BigNumber
  maxLTV?: BigNumber
  pairAddress: Address
  adjustedBorrowAmount?: BigNumber
  setAdjustedBorrowAmount: Dispatch<SetStateAction<BigNumber | undefined>>
  setAdjustedCollateralAmount: Dispatch<SetStateAction<BigNumber | undefined>>
  onSuccess: () => void
}

export const CreateLeveredPosition: FC<CreateLeveredPositionProps> = ({
  borrowAssetAddress,
  collateralAssetBalance,
  collateralAssetAddress,
  ltvPrecision,
  maxLTV,
  pairAddress,
  adjustedBorrowAmount,
  setAdjustedBorrowAmount,
  setAdjustedCollateralAmount,
  onSuccess,
}) => {
  const [addToast, replaceToast] = useToastStore(
    (state) => [state.addToast, state.replaceToast],
    shallow
  )

  const maxLeverage = calculateMaxLeverage({
    maxLTV,
    ltvPrecision,
  })

  const [collateralAmount, setCollateralAmount] = useState("")
  const [leverAmount, setLeverAmount] = useState(0)
  const [collateralAmountDebounced, setCollateralAmountDebounced] =
    useState<BigNumber>(BigNumber.from(0))

  const [debounceReady] = useDebounce(
    () => {
      if (leverAmount > 0 && !!collateralAmount) {
        const collateralAmountBig = parseUnits(
          collateralAmount || "0",
          collateralAssetBalance.data?.decimals
        )
        const leveredCollateralAmount = collateralAmountBig
          .mul(BigNumber.from(Math.floor(leverAmount * 100)))
          .div(100)
        setCollateralAmountDebounced(collateralAmountBig)
        setAdjustedBorrowAmount(
          leveredCollateralAmount?.sub(collateralAmountBig)
        )
        setAdjustedCollateralAmount(leveredCollateralAmount)
      }
    },
    500,
    [collateralAmount, leverAmount]
  )
  const isDebounced = debounceReady() ?? false

  useEffect(() => {
    return () => {
      setAdjustedBorrowAmount(undefined)
      setAdjustedCollateralAmount(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const approval = useTokenApproval({
    amount: ethers.constants.MaxUint256,
    spender: pairAddress,
    token: collateralAssetAddress,
    enabled: leverAmount > 1 && isDebounced,
  })
  const leverPosition = useLeverPosition({
    borrowAmount: adjustedBorrowAmount,
    borrowAssetAddress,
    collateralAmount: collateralAmountDebounced,
    minAmount: BigNumber.from(1),
    enabled: leverAmount > 1 && approval.isSufficient && isDebounced,
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
      <div className="flex gap-3">
        <Button
          className="w-full"
          isLoading={approval.write.isLoading || approval.wait.isLoading}
          disabled={approval.isSufficient || leverAmount === 1 || !isDebounced}
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
          className="w-full"
          isLoading={
            leverPosition.prepare.isLoading ||
            leverPosition.write.isLoading ||
            leverPosition.wait.isLoading
          }
          disabled={!approval.isSufficient || leverAmount === 1 || !isDebounced}
          onClick={() => {
            const action = "Creating levered position"
            const toastId = addToast({ type: "startTx", action })
            leverPosition.write
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
          Lever
          {leverPosition.prepare.isError ? " (error)" : ""}
        </Button>
      </div>
    </div>
  )
}
