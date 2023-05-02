import { FC, useState } from "react"
import React from "react"
import {
  Controller,
  SubmitHandler,
  useController,
  useFormContext,
} from "react-hook-form"
import { Address, useAccount, useSwitchNetwork } from "wagmi"

import clsxm from "@/lib/clsxm"
import { formatCurrencyUnits, parseCurrencyUnits } from "@/lib/helpers"
import { ProductType } from "@/lib/types"
import {
  useActiveChainId,
  useClientReady,
  useTokenOrNative,
  useTokenOrNativeBalance,
} from "@/hooks"

import { AssetBalance } from "@/components/Asset"
import Button from "@/components/Button"
import { ConnectButton } from "@/components/ConnectButton"
import TokenSelectModal from "@/components/Modal/TokenSelectModal"
import DoubleTokenSelectButton from "@/components/TokenForm/DoubleTokenSelectButton"
import TokenSelectButton from "@/components/TokenForm/TokenSelectButton"

type TokenFormProps = {
  asset?: Address
  chainId?: number
  submitText: string
  tokenAddresses?: Address[] | readonly Address[]
  isDebouncing: boolean
  isError: boolean
  isLoadingPreview: boolean
  isLoadingTransaction: boolean
  isWithdraw?: boolean
  previewResultWei?: string
  productType?: ProductType
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
  chainId,
  submitText,
  tokenAddresses = [],
  isDebouncing,
  isError,
  isLoadingPreview,
  isLoadingTransaction,
  isWithdraw = false,
  previewResultWei,
  productType,
  onSubmit,
}) => {
  const clientReady = useClientReady()
  const activeChainId = useActiveChainId()
  const { switchNetwork, isLoading: isSwitchingNetwork } = useSwitchNetwork()

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
    chainId,
    onSuccess: () => revalidateAmountIn(),
  })
  const { data: inputToken, isLoading: isLoadingInputToken } = useTokenOrNative(
    { address: inputTokenAddress, chainId }
  )
  const { data: outputToken } = useTokenOrNative({
    address: outputTokenAddress,
    chainId,
  })

  const showMaxBtn =
    clientReady &&
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
                const isValid = parseCurrencyUnits({
                  amountFormatted: amount,
                  decimals: inputToken?.decimals,
                }).lte(inputTokenBalanceOrShare?.value ?? 0)
                return isValid ? undefined : "Insufficient balance"
              },
            },
          }}
          render={({ field: { onChange, onBlur, value, name, ref } }) => (
            <input
              className="peer relative z-[2] col-start-1 row-start-1 block w-full text-ellipsis bg-transparent px-4 pb-2 pt-4 text-2xl placeholder-pink-100/50 focus:outline-none md:text-4xl"
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
          {productType === "concentrator" && isWithdraw ? (
            <DoubleTokenSelectButton
              canChange={!isWithdraw && tokenAddresses.length > 1}
              chainId={chainId}
              tokenAddress={inputTokenAddress}
              onClick={() => setTokenSelectMode("inputToken")}
            />
          ) : (
            <TokenSelectButton
              canChange={!isWithdraw && tokenAddresses.length > 1}
              chainId={chainId}
              tokenAddress={inputTokenAddress}
              onClick={() => setTokenSelectMode("inputToken")}
            />
          )}
        </div>

        {/* outputToken input */}
        <div
          className={clsxm(
            "peer relative z-[2] col-start-1 row-start-2 block w-full overflow-hidden text-ellipsis bg-transparent px-4 pb-4 pt-1 text-xl text-pink-100/60 placeholder-pink-100/60 focus:outline-none",
            { "animate-pulse": clientReady && isLoadingPreview }
          )}
        >
          <span>
            {formatCurrencyUnits({
              amountWei: previewResultWei,
              decimals: outputToken?.decimals,
            })}
          </span>
        </div>
        {/* outputToken select button */}
        <div className="relative z-[1] col-start-2 row-start-2 flex items-start space-x-1 justify-self-end pb-4 pr-4">
          {productType === "concentrator" && !isWithdraw ? (
            <DoubleTokenSelectButton
              canChange={isWithdraw && tokenAddresses.length > 1}
              chainId={chainId}
              tokenAddress={outputTokenAddress}
              onClick={() => setTokenSelectMode("outputToken")}
            />
          ) : (
            <TokenSelectButton
              canChange={isWithdraw && tokenAddresses.length > 1}
              chainId={chainId}
              tokenAddress={outputTokenAddress}
              onClick={() => setTokenSelectMode("outputToken")}
            />
          )}
        </div>

        <div className="relative z-[1] col-span-full col-start-1 row-start-3 h-[38px] px-4 pb-3 text-left align-bottom text-xs">
          <span className="text-pink-100">
            {!isWithdraw ? "Balance: " : "Share: "}
            <AssetBalance
              address={inputTokenAddress}
              chainId={chainId}
              abbreviate
            />
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
        {clientReady && isConnected ? (
          !!chainId && activeChainId !== chainId ? (
            <Button
              className="col-span-full mt-3 w-full"
              isLoading={isSwitchingNetwork}
              onClick={() => switchNetwork?.(chainId)}
            >
              Switch network
            </Button>
          ) : (
            <Button
              className="col-span-full mt-3 grid"
              disabled={!form.formState.isValid || isError}
              isLoading={
                !isError &&
                (isDebouncing ||
                  isLoadingInputToken ||
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
          )
        ) : (
          <ConnectButton className="col-span-full mt-3 w-full" />
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
