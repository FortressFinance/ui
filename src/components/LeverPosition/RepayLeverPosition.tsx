import * as ToggleGroup from "@radix-ui/react-toggle-group"
import React, { Dispatch, FC, SetStateAction, useEffect, useState } from "react"
import { SubmitHandler, useController, useForm } from "react-hook-form"
import { useDebounce } from "react-use"
import { useAccount } from "wagmi"
import { shallow } from "zustand/shallow"

import {
  addSlippage,
  assetToCollateral,
  collateralToAsset,
  subSlippage,
} from "@/lib"
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

import { useGlobalStore, useToastStore } from "@/store"

type RepayLeverPositionProps = {
  chainId: number
  borrowAmountSignificant: bigint
  borrowAssetAddress?: Address
  borrowAssetBalance: ReturnType<typeof useTokenOrNativeBalance>
  collateralAssetAddress?: Address
  collateralAssetBalance: ReturnType<typeof useTokenOrNativeBalance>
  collateralAmountSignificant: bigint
  isUpdatingAmounts: boolean
  setAdjustedBorrowAmount: Dispatch<SetStateAction<bigint | undefined>>
  setAdjustedCollateralAmount: Dispatch<SetStateAction<bigint | undefined>>
  setIsUpdatingAmounts: Dispatch<SetStateAction<boolean>>
  pairAddress: Address
  onSuccess: () => void
}

type RepayLeverPositionFormValues = {
  amount: string
  asset?: Address
}

export const RepayLeverPosition: FC<RepayLeverPositionProps> = ({
  chainId,
  borrowAmountSignificant,
  borrowAssetAddress,
  borrowAssetBalance,
  collateralAssetAddress,
  collateralAssetBalance,
  collateralAmountSignificant,
  isUpdatingAmounts,
  setAdjustedBorrowAmount,
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
  const slippageTolerance = useGlobalStore((state) => state.slippageTolerance)

  const pairLeverParams = usePairLeverParams({ chainId, pairAddress })

  const [selectedPreset, setSelectedPreset] = useState<string>("")
  const [isTokenSelectModalOpen, setIsTokenSelectModalOpen] = useState(false)
  const [repaymentAmount, setRepaymentAmount] = useState<bigint>(0n)

  const form = useForm<RepayLeverPositionFormValues>({
    values: { amount: "", asset: borrowAssetAddress },
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
    ? collateralAmountSignificant ?? 0n
    : borrowAssetBalance.data?.value ?? 0n
  const maximumAmountRepayable = isRepayingWithCollateral
    ? assetToCollateral(
        pairLeverParams.data.borrowedAmount ?? 0n,
        pairLeverParams.data.exchangeRate,
        pairLeverParams.data.constants?.exchangePrecision
      )
    : pairLeverParams.data.borrowedAmount ?? 0n

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
          return parsedAmount > maximumAmountRepayable
            ? "Exceeds maximum repayable"
            : parsedAmount > activeRepaymentBalanceAmount
            ? "Insufficient balance"
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

  useDebounce(
    () => {
      if (!Number(amount)) {
        setRepaymentAmount(0n)
        setAdjustedBorrowAmount(undefined)
        setAdjustedCollateralAmount(undefined)
      } else {
        const repaymentAmount = parseCurrencyUnits({
          amountFormatted: amount,
          decimals: activeRepaymentAsset?.decimals,
        })
        setRepaymentAmount(repaymentAmount)
        setAdjustedBorrowAmount(
          borrowAmountSignificant -
            (isRepayingWithCollateral
              ? collateralToAsset(
                  repaymentAmount,
                  pairLeverParams.data.exchangeRate,
                  pairLeverParams.data.constants?.exchangePrecision
                )
              : repaymentAmount)
        )
        setAdjustedCollateralAmount(
          isRepayingWithCollateral
            ? collateralAmountSignificant - repaymentAmount
            : undefined
        )
      }
      setIsUpdatingAmounts(false)
    },
    500,
    [amount, asset, selectedPreset]
  )

  useEffect(() => {
    return () => {
      setAdjustedBorrowAmount(undefined)
      setAdjustedCollateralAmount(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSuccess = () => {
    _onSuccess()
    form.reset({ amount: "" })
    setSelectedPreset("")
  }

  const repaymentAmountToApprove = addSlippage(repaymentAmount, 0.005)
  const approval = useTokenApproval({
    amount: repaymentAmountToApprove,
    spender: pairAddress,
    token: borrowAssetAddress,
    enabled:
      !isUpdatingAmounts && !isRepayingWithCollateral && repaymentAmount > 0,
    onSuccess: () => repayAsset.prepare.refetch(),
  })
  const sharesToRepay = useConvertToShares({
    amount: repaymentAmount,
    enabled:
      !isUpdatingAmounts && !isRepayingWithCollateral && approval.isSufficient,
    totalBorrowAmount: pairLeverParams.data.totalBorrowAmount,
    totalBorrowShares: pairLeverParams.data.totalBorrowShares,
    pairAddress,
  })
  const repayAsset = useRepayAsset({
    shares: sharesToRepay.data,
    enabled:
      !isUpdatingAmounts &&
      !isRepayingWithCollateral &&
      approval.isSufficient &&
      form.formState.isValid,
    pairAddress,
    onSuccess,
  })
  const repaymentAmountMin = collateralToAsset(
    subSlippage(repaymentAmount, slippageTolerance),
    pairLeverParams.data.exchangeRate,
    pairLeverParams.data.constants?.exchangePrecision
  )
  const repayAssetWithCollateral = useRepayAssetWithCollateral({
    borrowAssetAddress: borrowAssetAddress,
    collateralAmount: repaymentAmount,
    minAmount: repaymentAmountMin,
    enabled:
      !isUpdatingAmounts &&
      isRepayingWithCollateral &&
      repaymentAmount > 0 &&
      repaymentAmountMin > 0 &&
      form.formState.isValid,
    pairAddress,
    onSuccess,
  })
  const repay = isRepayingWithCollateral ? repayAssetWithCollateral : repayAsset

  const isSubmitDisabled =
    isUpdatingAmounts ||
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
            if (formatted === "" || inputRegex.test(escapeRegExp(formatted))) {
              setIsUpdatingAmounts(true)
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
            {isRepayingWithCollateral ? "Collateral available: " : "Balance: "}
            {formatCurrencyUnits({
              amountWei: activeRepaymentBalanceAmount.toString(),
              decimals: activeRepaymentAsset?.decimals,
              maximumFractionDigits: 6,
            })}
          </span>
          <button
            className="ml-1.5 -translate-y-[1px] rounded px-1.5 text-2xs font-semibold uppercase text-orange-300 ring-1 ring-orange-400 transition-colors duration-150 enabled:cursor-pointer enabled:hover:bg-orange-400/10 enabled:hover:text-orange-200 disabled:cursor-not-allowed disabled:opacity-30"
            onClick={() => {
              onChangeAmount(
                formatCurrencyUnits({
                  amountWei: activeRepaymentBalanceAmount.toString(),
                  decimals: activeRepaymentAsset?.decimals,
                })
              )
              setIsUpdatingAmounts(true)
            }}
            disabled={
              !isClientReady ||
              !isConnected ||
              isUpdatingAmounts ||
              activeRepaymentBalanceAmount === 0n ||
              activeRepaymentBalanceAmount === repaymentAmount
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
            setIsUpdatingAmounts(true)
            if (value) {
              const repaymentAmount =
                (maximumAmountRepayable * BigInt(value)) / 100n
              onChangeAmount(
                formatCurrencyUnits({
                  amountWei: repaymentAmount.toString(),
                  decimals: activeRepaymentAsset?.decimals,
                })
              )
              setSelectedPreset(value)
            } else {
              onChangeAmount("")
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

        {isClientReady && form.formState.isDirty ? (
          form.formState.isValid ? (
            isRepayingWithCollateral ? (
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitDisabled}
                isLoading={isRepayLoading}
              >
                {repayAssetWithCollateral.prepare.error?.message.includes(
                  "SlippageTooHigh"
                )
                  ? "Slippage too high"
                  : "Repay with collateral"}
              </Button>
            ) : approval.isSufficient ? (
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitDisabled}
                isLoading={isRepayLoading}
              >
                Repay
              </Button>
            ) : (
              <ApproveToken
                amount={repaymentAmountToApprove}
                approval={approval}
                spender={pairAddress}
              />
            )
          ) : (
            <Button className="w-full" disabled>
              {form.formState.errors.amount?.message ?? "Error"}
            </Button>
          )
        ) : (
          <Button className="w-full" disabled>
            Repay
          </Button>
        )}
      </div>
    </form>
  )
}
