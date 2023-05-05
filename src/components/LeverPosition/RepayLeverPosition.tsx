import * as ToggleGroup from "@radix-ui/react-toggle-group"
import { BigNumber } from "ethers"
import React, { Dispatch, FC, SetStateAction, useEffect, useState } from "react"
import { SubmitHandler, useController, useForm } from "react-hook-form"
import { useDebounce } from "react-use"
import { shallow } from "zustand/shallow"

import { addSlippage, assetToCollateral, collateralToAsset } from "@/lib"
import { formatCurrencyUnits, parseCurrencyUnits } from "@/lib/helpers"
import {
  useClientReady,
  useConvertToShares,
  usePairLeverParams,
  useRepayAsset,
  useRepayAssetWithCollateral,
  useTokenApproval,
  useTokenOrNativeBalance,
} from "@/hooks"

import { ApproveToken } from "@/components"
import Address from "@/components/Address"
import Button from "@/components/Button"
import TokenSelectModal from "@/components/Modal/TokenSelectModal"
import TokenSelectButton from "@/components/TokenForm/TokenSelectButton"

import { useToastStore } from "@/store"

type RepayLeverPositionProps = {
  chainId: number
  borrowAmountSignificant: BigNumber
  borrowAssetAddress?: Address
  borrowAssetBalance: ReturnType<typeof useTokenOrNativeBalance>
  collateralAssetAddress?: Address
  collateralAssetBalance: ReturnType<typeof useTokenOrNativeBalance>
  collateralAmountSignificant: BigNumber
  setAdjustedBorrowAmount: Dispatch<SetStateAction<BigNumber | undefined>>
  setAdjustedCollateralAmount: Dispatch<SetStateAction<BigNumber | undefined>>
  onSuccess: () => void
  pairAddress: Address
}

type RepayLeverPositionFormValues = {
  amount: string
  asset?: Address
}

const SLIPPAGE = 0.00001

export const RepayLeverPosition: FC<RepayLeverPositionProps> = ({
  chainId,
  borrowAmountSignificant,
  borrowAssetAddress,
  borrowAssetBalance,
  collateralAssetAddress,
  collateralAssetBalance,
  collateralAmountSignificant,
  setAdjustedBorrowAmount,
  setAdjustedCollateralAmount,
  onSuccess,
  pairAddress,
}) => {
  const isClientReady = useClientReady()
  const [addToast, replaceToast] = useToastStore(
    (state) => [state.addToast, state.replaceToast],
    shallow
  )

  const pairLeverParams = usePairLeverParams({ chainId, pairAddress })

  const [selectedPreset, setSelectedPreset] = useState<string>("")
  const [isTokenSelectModalOpen, setIsTokenSelectModalOpen] = useState(false)
  const [repaymentAmount, setRepaymentAmount] = useState<BigNumber>(
    BigNumber.from(0)
  )
  const [repaymentAmountMin, setRepaymentAmountMin] = useState<BigNumber>(
    BigNumber.from(0)
  )

  const form = useForm<RepayLeverPositionFormValues>({
    values: {
      amount: "0",
      asset: borrowAssetAddress,
    },
    mode: "all",
    reValidateMode: "onChange",
  })

  const amount = form.watch("amount")
  const asset = form.watch("asset") ?? "0x"

  const isRepayingWithCollateral = asset === collateralAssetAddress
  const activeRepaymentAsset = isRepayingWithCollateral
    ? collateralAssetBalance.data
    : borrowAssetBalance.data
  const activeRepaymentBalanceAmount = isRepayingWithCollateral
    ? collateralAmountSignificant ?? BigNumber.from(0)
    : borrowAssetBalance.data?.value ?? BigNumber.from(0)
  const maximumAmountRepayable = isRepayingWithCollateral
    ? assetToCollateral(
        borrowAmountSignificant,
        pairLeverParams.data.exchangeRate,
        pairLeverParams.data.constants?.exchangePrecision
      )
    : borrowAmountSignificant

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
            decimals: activeRepaymentAsset?.decimals,
          })
          return parsedAmount.gt(activeRepaymentBalanceAmount)
            ? "Insufficient balance"
            : parsedAmount.gt(maximumAmountRepayable)
            ? "Amount exceeds maximum"
            : undefined
        },
      },
    },
  })
  const assetField = useController({ name: "asset", control: form.control })

  const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group
  const escapeRegExp = (string: string): string => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") // $& means the whole matched string
  }

  // The debounceReady() callback won't always trigger a render...
  // In combination with react-hook-form, it's best to just track debounce status manually for consistent behavior
  const [isDebouncing, setIsDebouncing] = useState(false)
  useDebounce(
    () => {
      if (amount === "") {
        setRepaymentAmount(BigNumber.from(0))
        setAdjustedBorrowAmount(undefined)
        setAdjustedCollateralAmount(undefined)
      } else {
        const repaymentAmount = parseCurrencyUnits({
          amountFormatted: amount,
          decimals: activeRepaymentAsset?.decimals,
        })
        setRepaymentAmount(repaymentAmount)
        setAdjustedBorrowAmount(
          borrowAmountSignificant.sub(
            isRepayingWithCollateral
              ? collateralToAsset(
                  repaymentAmount,
                  pairLeverParams.data.exchangeRate,
                  pairLeverParams.data.constants?.exchangePrecision
                )
              : repaymentAmount
          )
        )
        setAdjustedCollateralAmount(
          collateralAmountSignificant.sub(
            isRepayingWithCollateral
              ? repaymentAmount
              : assetToCollateral(
                  repaymentAmount,
                  pairLeverParams.data.exchangeRate,
                  pairLeverParams.data.constants?.exchangePrecision
                )
          )
        )
      }
      setIsDebouncing(false)
    },
    500,
    [form.getValues("amount"), asset, selectedPreset]
  )

  useEffect(() => {
    return () => {
      setAdjustedBorrowAmount(undefined)
      setAdjustedCollateralAmount(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const approval = useTokenApproval({
    amount: repaymentAmount,
    spender: pairAddress,
    token: borrowAssetAddress,
    enabled: !isRepayingWithCollateral && repaymentAmount.gt(0),
  })
  const sharesToRepay = useConvertToShares({
    amount: repaymentAmount,
    enabled: !isRepayingWithCollateral && approval.isSufficient,
    totalBorrowAmount: pairLeverParams.data.totalBorrowAmount,
    totalBorrowShares: pairLeverParams.data.totalBorrowShares,
    pairAddress,
  })
  const repayAsset = useRepayAsset({
    shares: sharesToRepay.data,
    enabled: !isRepayingWithCollateral && approval.isSufficient,
    pairAddress,
    onSuccess,
  })
  const repayAssetWithCollateral = useRepayAssetWithCollateral({
    borrowAssetAddress: borrowAssetAddress,
    collateralAmount: repaymentAmount,
    minAmount: repaymentAmountMin,
    enabled:
      isRepayingWithCollateral &&
      repaymentAmount.gt(0) &&
      repaymentAmountMin.gt(0),
    pairAddress,
    onSuccess,
  })
  const repay = isRepayingWithCollateral ? repayAssetWithCollateral : repayAsset

  const isSubmitDisabled =
    isDebouncing ||
    form.formState.isValidating ||
    !form.formState.isValid ||
    repay.prepare.isError
  const isRepayLoading =
    repay.prepare.isLoading || repay.write.isLoading || repay.wait.isLoading

  const submitRepayment: SubmitHandler<RepayLeverPositionFormValues> = () => {
    const action = isRepayingWithCollateral
      ? "Repayment with collateral"
      : "Repayment"
    const toastId = addToast({ type: "startTx", action })
    repay.write
      .writeAsync?.()
      .then((receipt) =>
        replaceToast(toastId, { type: "waitTx", action, hash: receipt.hash })
      )
      .catch((error) =>
        replaceToast(toastId, { type: "errorWrite", action, error })
      )
  }

  return (
    <>
      <form onSubmit={form.handleSubmit(submitRepayment)}>
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
                setSelectedPreset("")
                onChangeAmount(formatted)
              }
            }}
          />

          <div className="relative z-[1] col-start-2 row-start-1 flex items-center justify-self-end pr-4">
            <TokenSelectButton
              canChange
              chainId={chainId}
              tokenAddress={asset}
              onClick={() => setIsTokenSelectModalOpen(true)}
            />
          </div>

          <div className="relative z-[1] col-span-full col-start-1 row-start-2 px-4 pb-4 text-left align-bottom text-xs">
            <span className="text-pink-100">
              {isRepayingWithCollateral
                ? "Collateral available: "
                : "Balance: "}
              {formatCurrencyUnits({
                amountWei: isRepayingWithCollateral
                  ? borrowAssetBalance.data?.value.toString()
                  : pairLeverParams.data.collateralAmount?.toString(),
                decimals: activeRepaymentAsset?.decimals,
                abbreviate: true,
              })}
            </span>
          </div>

          <div
            className="col-span-full col-start-1 row-span-full row-start-1 rounded bg-pink-100/10 ring-1 ring-inset ring-transparent peer-hover:ring-pink-100/10 peer-focus:ring-pink-100/30"
            aria-hidden="true"
          />

          <TokenSelectModal
            isOpen={isTokenSelectModalOpen}
            onClose={() => setIsTokenSelectModalOpen(false)}
            controller={assetField}
            onChangeToken={() => {
              form.setValue("amount", "")
              setSelectedPreset("")
            }}
            title="Repayment options"
            tokens={[
              { address: borrowAssetAddress, badge: "Asset" },
              { address: collateralAssetAddress, badge: "Collateral" },
            ]}
          />
        </div>

        <div className="mt-3 flex items-center gap-3">
          <ToggleGroup.Root
            type="single"
            className="flex h-12 w-1/2 shrink-0 justify-center gap-1.5"
            disabled={repay.write.isLoading || repay.wait.isLoading}
            value={selectedPreset}
            onValueChange={(value) => {
              setIsDebouncing(true)
              if (value) {
                const repaymentAmount = maximumAmountRepayable
                  .mul(BigNumber.from(value))
                  .div(100)
                form.setValue(
                  "amount",
                  formatCurrencyUnits({
                    amountWei: addSlippage(
                      repaymentAmount,
                      SLIPPAGE * 10
                    ).toString(),
                    decimals: activeRepaymentAsset?.decimals,
                  }),
                  {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  }
                )
                setRepaymentAmountMin(repaymentAmount)
                setSelectedPreset(value)
              } else {
                form.setValue("amount", "")
                setRepaymentAmountMin(BigNumber.from(0))
                setSelectedPreset("")
              }
            }}
          >
            <ToggleGroup.Item value="25" asChild>
              <Button
                variant="outline"
                className="w-1/4 text-sm ui-state-on:bg-pink/50"
              >
                25%
              </Button>
            </ToggleGroup.Item>
            <ToggleGroup.Item value="50" asChild>
              <Button
                variant="outline"
                className="w-1/4 text-sm ui-state-on:bg-pink/50"
              >
                50%
              </Button>
            </ToggleGroup.Item>
            <ToggleGroup.Item value="75" asChild>
              <Button
                variant="outline"
                className="w-1/4 text-sm ui-state-on:bg-pink/50"
              >
                75%
              </Button>
            </ToggleGroup.Item>
            <ToggleGroup.Item value="100" asChild>
              <Button
                variant="outline"
                className="w-1/4 text-sm ui-state-on:bg-pink/50"
              >
                100%
              </Button>
            </ToggleGroup.Item>
          </ToggleGroup.Root>

          {isClientReady ? (
            isRepayingWithCollateral ? (
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitDisabled}
                isLoading={isRepayLoading}
              >
                {repay.prepare.isError ? "Error" : "Repay with collateral"}
              </Button>
            ) : approval.isSufficient ? (
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitDisabled}
                isLoading={isRepayLoading}
              >
                {repay.prepare.isError ? "Error" : "Repay"}
              </Button>
            ) : (
              <ApproveToken
                amount={repaymentAmount}
                approval={approval}
                disabled={isSubmitDisabled}
              />
            )
          ) : (
            <Button className="w-full" disabled>
              Repay
            </Button>
          )}
        </div>
      </form>
    </>
  )
}
