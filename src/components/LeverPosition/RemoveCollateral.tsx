import { BigNumber } from "ethers"
import React, { Dispatch, FC, SetStateAction, useEffect, useState } from "react"
import { useController, useForm } from "react-hook-form"
import { useDebounce } from "react-use"
import { Address, useAccount } from "wagmi"
import { shallow } from "zustand/shallow"

import { formatCurrencyUnits, parseCurrencyUnits } from "@/lib/helpers"
import {
  useClientReady,
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
  collateralAmountSignificant: BigNumber
  setAdjustedCollateralAmount: Dispatch<SetStateAction<BigNumber | undefined>>
  onSuccess: () => void
  pairAddress: Address
}

type AddCollateralFormValues = {
  amount: string
}

export const RemoveCollateral: FC<RemoveCollateralProps> = ({
  chainId,
  collateralAssetAddress,
  collateralAssetBalance,
  collateralAmountSignificant,
  setAdjustedCollateralAmount,
  onSuccess,
  pairAddress,
}) => {
  const isClientReady = useClientReady()
  const { isConnected } = useAccount()
  const [addToast, replaceToast] = useToastStore(
    (state) => [state.addToast, state.replaceToast],
    shallow
  )

  const [removedAmount, setRemovedAmount] = useState<BigNumber>(
    BigNumber.from(0)
  )

  const form = useForm<AddCollateralFormValues>({
    values: { amount: "" },
    mode: "all",
    reValidateMode: "onChange",
  })

  const amount = form.watch("amount")

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
          }).lte(collateralAmountSignificant),
      },
    },
  })

  const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group
  const escapeRegExp = (string: string): string => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") // $& means the whole matched string
  }

  // The debounceReady() callback won't always trigger a render...
  // In combination with react-hook-form, it's best to just track debounce status manually for consistent behavior
  const [isDebouncing, setIsDebouncing] = useState(false)
  useDebounce(
    () => {
      if (!Number(amount)) {
        setRemovedAmount(BigNumber.from(0))
        setAdjustedCollateralAmount(undefined)
      } else {
        const removedAmount = parseCurrencyUnits({
          amountFormatted: amount,
          decimals: collateralAssetBalance.data?.decimals,
        })
        setRemovedAmount(removedAmount)
        setAdjustedCollateralAmount(
          collateralAmountSignificant.sub(removedAmount)
        )
      }
      setIsDebouncing(false)
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

  const removeCollateral = useRemoveCollateral({
    collateralAmount: removedAmount,
    enabled: removedAmount.gt(0) && form.formState.isValid,
    pairAddress,
    onSuccess,
  })

  return (
    <>
      <form
        onSubmit={form.handleSubmit(() => {
          const action = "Depositing additional collateral"
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
                setIsDebouncing(true)
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
              Balance:{" "}
              {formatCurrencyUnits({
                amountWei: collateralAmountSignificant.toString(),
                decimals: collateralAssetBalance.data?.decimals,
                abbreviate: true,
              })}
            </span>
            <button
              className="ml-1.5 cursor-pointer rounded border border-orange-400 px-2 py-1 font-semibold text-pink-100"
              onClick={() =>
                form.setValue(
                  "amount",
                  formatCurrencyUnits({
                    amountWei: collateralAmountSignificant.toString(),
                    decimals: collateralAssetBalance.data?.decimals,
                    abbreviate: true,
                  })
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
          <Button
            type="submit"
            className="w-full"
            disabled={
              !isClientReady ||
              isDebouncing ||
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
