import React, { Dispatch, FC, SetStateAction, useEffect, useState } from "react"
import { useController, useForm } from "react-hook-form"
import { useDebounce } from "react-use"
import { Address, useAccount } from "wagmi"
import { shallow } from "zustand/shallow"

import { assetToCollateral, calculateMinCollateralRequired } from "@/lib"
import { formatCurrencyUnits, parseCurrencyUnits } from "@/lib/helpers"
import {
  useClientReady,
  usePairLeverParams,
  useRemoveCollateral,
  useTokenOrNativeBalance,
} from "@/hooks"

import Button from "@/components/Button"
import TokenSelectButton from "@/components/TokenForm/TokenSelectButton"

import { useToastStore } from "@/store"

type RemoveCollateralProps = {
  chainId: number
  collateralAssetAddress?: Address
  collateralAssetBalance: ReturnType<typeof useTokenOrNativeBalance>
  collateralAmountSignificant: bigint
  isUpdatingAmounts: boolean
  setAdjustedCollateralAmount: Dispatch<SetStateAction<bigint | undefined>>
  setIsUpdatingAmounts: Dispatch<SetStateAction<boolean>>
  pairAddress: Address
  onSuccess: () => void
}

type AddCollateralFormValues = {
  amount: string
}

export const RemoveCollateral: FC<RemoveCollateralProps> = ({
  chainId,
  collateralAssetAddress,
  collateralAssetBalance,
  collateralAmountSignificant,
  isUpdatingAmounts,
  setAdjustedCollateralAmount,
  setIsUpdatingAmounts,
  pairAddress,
  onSuccess: _onSuccess,
}) => {
  const isClientReady = useClientReady()
  const { isConnected } = useAccount()
  const [addToast, replaceToast] = useToastStore(
    (state) => [state.addToast, state.replaceToast],
    shallow
  )

  const pairLeverParams = usePairLeverParams({ chainId, pairAddress })

  const [removedAmount, setRemovedAmount] = useState<bigint>(0n)

  const form = useForm<AddCollateralFormValues>({
    values: { amount: "" },
    mode: "all",
    reValidateMode: "onChange",
  })

  const amount = form.watch("amount")
  const minCollateralRequired = calculateMinCollateralRequired({
    borrowedAmountAsCollateral: assetToCollateral(
      pairLeverParams.data.borrowedAmount,
      pairLeverParams.data.exchangeRate,
      pairLeverParams.data.constants?.exchangePrecision
    ),
    maxLTV: pairLeverParams.data.maxLTV,
    ltvPrecision: pairLeverParams.data.constants?.ltvPrecision,
  })
  const maxCollateralWithdrawable =
    collateralAmountSignificant - minCollateralRequired

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
        lessThanBalance: (amount) =>
          parseCurrencyUnits({
            amountFormatted: amount,
            decimals: collateralAssetBalance.data?.decimals,
          }) <= maxCollateralWithdrawable,
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
        setRemovedAmount(0n)
        setAdjustedCollateralAmount(undefined)
      } else {
        const removedAmount = parseCurrencyUnits({
          amountFormatted: amount,
          decimals: collateralAssetBalance.data?.decimals,
        })
        setRemovedAmount(removedAmount)
        setAdjustedCollateralAmount(collateralAmountSignificant - removedAmount)
      }
      setIsUpdatingAmounts(false)
    },
    500,
    [form.getValues("amount")]
  )

  useEffect(() => {
    return () => {
      setAdjustedCollateralAmount(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSuccess = () => {
    _onSuccess()
    form.reset({ amount: "" })
  }

  const removeCollateral = useRemoveCollateral({
    collateralAmount: removedAmount,
    enabled: !isUpdatingAmounts && removedAmount > 0 && form.formState.isValid,
    pairAddress,
    onSuccess,
  })

  return (
    <>
      <form
        onSubmit={form.handleSubmit(() => {
          const action = "Collateral removal"
          const toastId = addToast({ type: "startTx", action })
          removeCollateral.write
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
        })}
      >
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
              if (
                formatted === "" ||
                inputRegex.test(escapeRegExp(formatted))
              ) {
                setIsUpdatingAmounts(true)
                onChangeAmount(formatted)
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
              Collateral withdrawable:{" "}
              {isClientReady && isConnected
                ? formatCurrencyUnits({
                    amountWei: maxCollateralWithdrawable.toString(),
                    decimals: collateralAssetBalance.data?.decimals,
                    maximumFractionDigits: 6,
                  })
                : "—"}
            </span>
            <button
              className="ml-1.5 -translate-y-[1px] rounded px-1.5 text-2xs font-semibold uppercase text-orange-300 ring-1 ring-orange-400 transition-colors duration-150 enabled:cursor-pointer enabled:hover:bg-orange-400/10 enabled:hover:text-orange-200 disabled:cursor-not-allowed disabled:opacity-30"
              onClick={() => {
                onChangeAmount(
                  formatCurrencyUnits({
                    amountWei: maxCollateralWithdrawable.toString(),
                    decimals: collateralAssetBalance.data?.decimals,
                  })
                )
                setIsUpdatingAmounts(true)
              }}
              disabled={
                !isClientReady ||
                !isConnected ||
                isUpdatingAmounts ||
                maxCollateralWithdrawable === 0n ||
                maxCollateralWithdrawable === removedAmount
              }
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
          <Button
            type="submit"
            className="w-full"
            disabled={
              !isClientReady ||
              isUpdatingAmounts ||
              form.formState.isValidating ||
              !form.formState.isValid ||
              removeCollateral.prepare.isError
            }
            isLoading={
              removeCollateral.prepare.isLoading ||
              removeCollateral.write.isLoading ||
              removeCollateral.wait.isLoading
            }
          >
            {removeCollateral.prepare.isError ? "Error" : "Remove collateral"}
          </Button>
        </div>
      </form>
    </>
  )
}
