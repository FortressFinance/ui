import * as ToggleGroup from "@radix-ui/react-toggle-group"
import { BigNumber } from "ethers"
import React, { Dispatch, FC, SetStateAction, useState } from "react"
import { SubmitHandler, useController, useForm } from "react-hook-form"
import { useDebounce } from "react-use"
import { Address, useAccount } from "wagmi"
import { shallow } from "zustand/shallow"

import { calculateMaxLeverage } from "@/lib"
import { formatCurrencyUnits, parseCurrencyUnits } from "@/lib/helpers"
import {
  useClientReady,
  useLeverPosition,
  usePairLeverParams,
  useTokenApproval,
  useTokenOrNativeBalance,
} from "@/hooks"

import { ApproveToken } from "@/components"
import Button from "@/components/Button"
import TokenSelectButton from "@/components/TokenForm/TokenSelectButton"

import { useToastStore } from "@/store"

type CreateLeverPositionProps = {
  chainId: number
  borrowAssetAddress?: Address
  collateralAssetAddress?: Address
  collateralAssetBalance: ReturnType<typeof useTokenOrNativeBalance>
  adjustedBorrowAmount?: BigNumber
  isUpdatingAmounts: boolean
  setAdjustedBorrowAmount: Dispatch<SetStateAction<BigNumber | undefined>>
  setAdjustedCollateralAmount: Dispatch<SetStateAction<BigNumber | undefined>>
  setIsUpdatingAmounts: Dispatch<SetStateAction<boolean>>
  pairAddress: Address
  onSuccess: () => void
}

type CreateLeverPositionFormValues = {
  amount: string
  leverAmount: number
}

export const CreateLeverPosition: FC<CreateLeverPositionProps> = ({
  chainId,
  borrowAssetAddress,
  collateralAssetAddress,
  collateralAssetBalance,
  adjustedBorrowAmount,
  isUpdatingAmounts,
  setAdjustedBorrowAmount,
  setAdjustedCollateralAmount,
  setIsUpdatingAmounts,
  pairAddress,
  onSuccess,
}) => {
  const isClientReady = useClientReady()
  const { isConnected } = useAccount()
  const [addToast, replaceToast] = useToastStore(
    (state) => [state.addToast, state.replaceToast],
    shallow
  )

  const pairLeverParams = usePairLeverParams({ chainId, pairAddress })
  const maxLeverage = calculateMaxLeverage({
    maxLTV: pairLeverParams.data.maxLTV,
    ltvPrecision: pairLeverParams.data.constants?.ltvPrecision,
  })
  const leverageOptionsList = isClientReady
    ? Array(Math.floor(maxLeverage) - 1)
    : Array(4)

  const [collateralAmount, setCollateralAmount] = useState<BigNumber>(
    BigNumber.from(0)
  )

  const form = useForm<CreateLeverPositionFormValues>({
    values: { amount: "", leverAmount: 1 },
    mode: "all",
    reValidateMode: "onChange",
  })

  const amount = form.watch("amount")
  const leverAmount = form.watch("leverAmount")
  const availableAmount =
    collateralAssetBalance.data?.value ?? BigNumber.from(0)

  const {
    field: { onChange: onChangeAmount, ...amountField },
  } = useController({
    name: "amount",
    control: form.control,
    rules: {
      maxLength: 79,
      pattern: /^[0-9]*[.,]?[0-9]*$/i,
      validate: {
        positive: (amount) => Number(amount) > 0 || "Enter an amount",
        lessThanBalance: (amount) => {
          const parsedAmount = parseCurrencyUnits({
            amountFormatted: amount,
            decimals: collateralAssetBalance.data?.decimals,
          })
          return parsedAmount.gt(availableAmount)
            ? "Insufficient balance"
            : undefined
        },
      },
    },
  })
  const { field: leverAmountField } = useController({
    name: "leverAmount",
    control: form.control,
    rules: {
      validate: {
        validLeverage: (leverAmount) =>
          (leverAmount > 1 && leverAmount <= maxLeverage) ||
          "Invalid lever amount",
      },
    },
  })

  const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group
  const escapeRegExp = (string: string): string => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") // $& means the whole matched string
  }

  useDebounce(
    () => {
      if (!Number(amount)) {
        setCollateralAmount(BigNumber.from(0))
        setAdjustedBorrowAmount(undefined)
        setAdjustedCollateralAmount(undefined)
      } else {
        const collateralAmount = parseCurrencyUnits({
          amountFormatted: amount,
          decimals: collateralAssetBalance.data?.decimals,
        })
        const leveredCollateralAmount = collateralAmount
          .mul(BigNumber.from(Math.floor(leverAmount * 100)))
          .div(100)
        setCollateralAmount(collateralAmount)
        setAdjustedBorrowAmount(
          leverAmount > 1
            ? leveredCollateralAmount?.sub(collateralAmount)
            : undefined
        )
        setAdjustedCollateralAmount(
          leverAmount > 1 ? leveredCollateralAmount : undefined
        )
      }
      setIsUpdatingAmounts(false)
    },
    500,
    [amount, leverAmount]
  )

  const approval = useTokenApproval({
    amount: collateralAmount,
    spender: pairAddress,
    token: borrowAssetAddress,
    enabled: !isUpdatingAmounts && collateralAmount.gt(0),
  })
  const leverPosition = useLeverPosition({
    borrowAmount: adjustedBorrowAmount,
    borrowAssetAddress,
    collateralAmount,
    minAmount: BigNumber.from(1),
    enabled:
      !isUpdatingAmounts &&
      leverAmount > 1 &&
      approval.isSufficient &&
      !isUpdatingAmounts,
    pairAddress,
    onSuccess,
  })

  const isSubmitDisabled =
    isUpdatingAmounts ||
    form.formState.isValidating ||
    !form.formState.isValid ||
    leverPosition.prepare.isError
  const isLeverPositionLoading =
    leverPosition.prepare.isLoading ||
    leverPosition.write.isLoading ||
    leverPosition.wait.isLoading

  const submitPosition: SubmitHandler<CreateLeverPositionFormValues> = () => {
    const action = "Creating levered position"
    const toastId = addToast({ type: "startTx", action })
    leverPosition.write
      .writeAsync?.()
      .then((receipt) =>
        replaceToast(toastId, { type: "waitTx", action, hash: receipt.hash })
      )
      .catch((error) =>
        replaceToast(toastId, { type: "errorWrite", action, error })
      )
  }

  return (
    <form onSubmit={form.handleSubmit(submitPosition)}>
      <div className="grid w-full grid-cols-[1fr,auto] grid-rows-[1fr,auto]">
        <input
          {...amountField}
          className="peer relative z-[2] col-start-1 row-start-1 block w-full text-ellipsis bg-transparent px-4 pb-2.5 pt-4 text-2xl placeholder-pink-100/50 focus:outline-none md:text-4xl"
          inputMode="decimal"
          autoComplete="off"
          autoCorrect="off"
          type="text"
          spellCheck="false"
          placeholder="0.0"
          onChange={(event) => {
            const amount = event.target.value
            const formatted = amount.replace(/,/g, ".")
            if (formatted === "" || inputRegex.test(escapeRegExp(formatted))) {
              setIsUpdatingAmounts(true)
              onChangeAmount(formatted)
              if (formatted === "") leverAmountField.onChange(1)
            }
          }}
        />

        <div className="relative z-[1] col-start-2 row-start-1 flex items-center justify-self-end pr-4">
          <TokenSelectButton
            chainId={chainId}
            tokenAddress={collateralAssetAddress ?? "0x"}
          />
        </div>

        <div className="relative z-[1] col-span-full col-start-1 row-start-2 px-4 pb-4 text-left align-bottom text-xs">
          <span className="text-pink-100">
            Collateral available:{" "}
            {isClientReady && isConnected
              ? formatCurrencyUnits({
                  amountWei: collateralAssetBalance.data?.value.toString(),
                  decimals: collateralAssetBalance.data?.decimals,
                  maximumFractionDigits: 6,
                })
              : "—"}
          </span>
          <button
            className="ml-1.5 cursor-pointer rounded border border-orange-400 px-2 py-1 font-semibold text-pink-100"
            onClick={() =>
              form.setValue(
                "amount",
                formatCurrencyUnits({
                  amountWei: collateralAssetBalance.data?.value.toString(),
                  decimals: collateralAssetBalance.data?.decimals,
                }),
                { shouldDirty: true, shouldTouch: true, shouldValidate: true }
              )
            }
            disabled={!isClientReady || !isConnected}
            type="button"
          >
            Max
          </button>
        </div>

        <div
          className="col-span-full col-start-1 row-span-full row-start-1 rounded bg-pink-100/10 ring-1 ring-inset ring-transparent peer-hover:ring-pink-100/10 peer-focus:ring-pink-100/30"
          aria-hidden="true"
        />
      </div>

      <div className="mt-3 flex items-center gap-3">
        <ToggleGroup.Root
          type="single"
          className="flex h-12 w-1/2 shrink-0 justify-center gap-1.5"
          disabled={
            collateralAmount.eq(0) ||
            leverPosition.write.isLoading ||
            leverPosition.wait.isLoading
          }
          value={String(leverAmountField.value)}
          onValueChange={(value) => {
            setIsUpdatingAmounts(true)
            leverAmountField.onChange(value ? Number(value) : 1)
          }}
        >
          {Array.from(leverageOptionsList).map((_, index) => (
            <ToggleGroup.Item
              key={`lever-preset-${index}`}
              value={String(index + 2)}
              asChild
            >
              <Button
                variant="outline"
                className="w-full text-sm ui-state-on:bg-pink/50"
              >
                {index + 2}x
              </Button>
            </ToggleGroup.Item>
          ))}
        </ToggleGroup.Root>

        {isClientReady && isConnected && form.formState.isDirty ? (
          approval.isSufficient ? (
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitDisabled}
              isLoading={isLeverPositionLoading}
            >
              Lever position
            </Button>
          ) : (
            <ApproveToken
              amount={collateralAmount}
              approval={approval}
              disabled={isSubmitDisabled}
            />
          )
        ) : (
          <Button className="w-full" disabled>
            Lever position
          </Button>
        )}
      </div>
    </form>
  )
}
