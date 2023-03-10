import { BigNumber } from "ethers"
import { FC, useState } from "react"
import React from "react"
import {
  Controller,
  SubmitHandler,
  useController,
  useFormContext,
} from "react-hook-form"
import { Address, useAccount } from "wagmi"

import clsxm from "@/lib/clsxm"
import { parseTokenUnits } from "@/lib/helpers"
import { usePreviewDeposit, usePreviewRedeem } from "@/hooks/data/preview"
import useTokenOrNative from "@/hooks/useTokenOrNative"
import useTokenOrNativeBalance from "@/hooks/useTokenOrNativeBalance"

import { AssetBalance } from "@/components/Asset"
import Button from "@/components/Button"
import ConnectWalletButton from "@/components/ConnectWallet/ConnectWalletButton"
import Currency from "@/components/Currency"
import TokenSelectButton from "@/components/TokenForm/TokenSelectButton"
import TokenSelectModal from "@/components/TokenForm/TokenSelectModal"

type TokenFormProps = {
  asset: Address | undefined
  submitText: string
  tokenAddresses: Address[] | readonly Address[] | undefined
  isError: boolean
  isLoadingPreview: boolean
  isLoadingTransaction: boolean
  isWithdraw?: boolean
  preview: ReturnType<typeof usePreviewDeposit | typeof usePreviewRedeem>
  onSubmit: SubmitHandler<TokenFormValues>
}

type TokenSelectMode = "inputToken" | "outputToken" | null

export type TokenFormValues = {
  amountIn: string
  inputToken: Address
  outputToken: Address
}

const TokenForm: FC<TokenFormProps> = ({
  asset,
  submitText,
  tokenAddresses,
  isError,
  isLoadingPreview,
  isLoadingTransaction,
  isWithdraw = false,
  preview,
  onSubmit,
}) => {
  const [tokenSelectMode, setTokenSelectMode] = useState<TokenSelectMode>(null)

  const form = useFormContext<TokenFormValues>()
  const inputTokenAddress = form.watch("inputToken")
  const outputTokenAddress = form.watch("outputToken")
  const amountIn = form.watch("amountIn")

  const tokenSelectField = useController({
    name: isWithdraw ? "outputToken" : "inputToken",
    control: form.control,
  })

  const revalidateAmountIn = () => {
    if (amountIn !== "") form.trigger("amountIn")
  }

  const onClickMax = () => {
    form.setValue("amountIn", inputTokenBalanceOrShare?.formatted ?? "0.0", {
      shouldDirty: true,
      shouldValidate: true,
      shouldTouch: true,
    })
  }

  const { isConnected } = useAccount()
  const {
    data: inputTokenBalanceOrShare,
    isLoading: isLoadingInputTokenBalanceOrShare,
  } = useTokenOrNativeBalance({
    address: inputTokenAddress,
    onSuccess: () => revalidateAmountIn(),
  })
  const { data: inputToken, isLoading: isLoadingInputToken } = useTokenOrNative(
    { address: inputTokenAddress }
  )
  const { data: outputToken } = useTokenOrNative({
    address: outputTokenAddress,
  })

  const showMaxBtn =
    inputTokenBalanceOrShare?.value?.gt(0) &&
    inputTokenBalanceOrShare?.formatted !== amountIn

  const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group
  const escapeRegExp = (string: string): string => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") // $& means the whole matched string
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid-row-[1fr,auto,auto,max-content] grid w-full grid-cols-[auto,auto]">
        {/* inputToken input */}
        <Controller
          control={form.control}
          name="amountIn"
          rules={{
            maxLength: 79,
            pattern: /^[0-9]*[.,]?[0-9]*$/i,
            validate: {
              positive: (amount) => Number(amount) > 0 || "Enter an amount",
              lessThanBalance: (amount) => {
                const isValid = parseTokenUnits(
                  amount,
                  inputToken?.decimals
                ).lte(inputTokenBalanceOrShare?.value ?? 0)
                return isValid ? undefined : "Insufficient balance"
              },
            },
          }}
          render={({ field: { onChange, onBlur, value, name, ref } }) => (
            <input
              className="peer relative z-[2] col-start-1 row-start-1 block w-full text-ellipsis bg-transparent px-4 pt-4 pb-2 text-2xl placeholder-pink-100/50 focus:outline-none md:text-4xl"
              step="any"
              // universal input options
              inputMode="decimal"
              autoComplete="off"
              autoCorrect="off"
              // text-specific options
              type="text"
              spellCheck="false"
              placeholder="0.0"
              onBlur={onBlur} // notify when input is touched
              ref={ref}
              name={name}
              value={value}
              onChange={(event) => {
                const amount = event.target.value
                const formatted = amount.replace(/,/g, ".")
                if (
                  formatted === "" ||
                  inputRegex.test(escapeRegExp(formatted))
                ) {
                  onChange(formatted)
                }
              }}
            />
          )}
        />

        {/* inputToken select button */}
        <div className="relative z-[1] col-start-2 row-start-1 flex items-start justify-self-end pr-4 pt-4">
          <TokenSelectButton
            canChange={
              !isWithdraw &&
              isConnected &&
              !!tokenAddresses &&
              tokenAddresses.length > 1
            }
            tokenAddress={inputTokenAddress}
            onClick={() => setTokenSelectMode("inputToken")}
          />
        </div>

        {/* outputToken input */}
        <div
          className={clsxm(
            "peer relative z-[2] col-start-1 row-start-2 block w-full text-ellipsis bg-transparent px-4 pb-4 pt-1 text-xl text-pink-100/60 placeholder-pink-100/60 focus:outline-none",
            { "animate-pulse": isLoadingPreview }
          )}
        >
          <Currency
            amount={BigNumber.from(preview.data?.resultWei ?? "0")}
            decimals={outputToken?.decimals ?? 18}
          />
        </div>
        {/* outputToken select button */}
        <div className="relative z-[1] col-start-2 row-start-2 flex items-start space-x-1 justify-self-end pr-4 pb-4">
          <TokenSelectButton
            canChange={
              isWithdraw &&
              isConnected &&
              !!tokenAddresses &&
              tokenAddresses.length > 1
            }
            tokenAddress={outputTokenAddress}
            onClick={() => setTokenSelectMode("outputToken")}
          />
        </div>

        <div className="relative z-[1] col-span-full col-start-1 row-start-3 h-[38px] px-4 pb-3 text-left align-bottom text-xs">
          <span className="text-pink-100">
            {!isWithdraw ? "Balance: " : "Share: "}
            <AssetBalance address={inputTokenAddress} />
          </span>
          <button
            className="ml-1.5 cursor-pointer rounded border border-orange-400 px-2 py-1 font-semibold text-pink-100"
            onClick={onClickMax}
            disabled={!showMaxBtn}
            type="button"
          >
            Max
          </button>
        </div>

        {/* Focus styles */}
        <div
          className="col-span-full col-start-1 row-span-3 row-start-1 rounded bg-pink-100/10 ring-1 ring-inset ring-transparent peer-hover:ring-pink-100/10 peer-focus:ring-pink-100/30"
          aria-hidden="true"
        />

        {/* Submit button (or Connect Wallet if not connected) */}
        {isConnected ? (
          <Button
            className="col-span-full mt-3 grid"
            disabled={!form.formState.isValid || isError}
            isLoading={
              !isError &&
              (isLoadingInputToken ||
                isLoadingInputTokenBalanceOrShare ||
                isLoadingTransaction)
            }
            type="submit"
          >
            {isError
              ? "Error preparing transaction"
              : form.formState.isDirty
              ? form.formState.isValid
                ? submitText
                : form.formState.errors.amountIn
                ? `Insufficient ${inputToken?.symbol ?? ""} ${
                    isWithdraw ? "share" : "balance"
                  }`
                : "Enter an amount"
              : "Enter an amount"}
          </Button>
        ) : (
          <ConnectWalletButton className="col-span-full mt-3 w-full" />
        )}

        {/* Token selection modal */}
        <TokenSelectModal
          controller={tokenSelectField}
          asset={asset}
          isOpen={tokenSelectMode !== null}
          tokenAddresses={tokenAddresses}
          onClose={() => setTokenSelectMode(null)}
          onChangeToken={revalidateAmountIn}
        />
      </div>
    </form>
  )
}

export default TokenForm
