import { parseUnits } from "ethers/lib/utils.js"
import { FC, useState } from "react"
import { SubmitHandler, useController, useFormContext } from "react-hook-form"
import { Address, useAccount } from "wagmi"

import clsxm from "@/lib/clsxm"
import useTokenOrNative from "@/hooks/useTokenOrNative"
import useTokenOrNativeBalance from "@/hooks/useTokenOrNativeBalance"

import Button from "@/components/Button"
import ConnectWalletButton from "@/components/ConnectWallet/ConnectWalletButton"
import TokenSelectButton from "@/components/TokenForm/TokenSelectButton"
import TokenSelectModal from "@/components/TokenForm/TokenSelectModal"

type TokenFormProps = {
  isLoadingPreview: boolean
  isLoadingTransaction: boolean
  isWithdraw?: boolean
  submitText: string
  tokenAddreseses: Address[] | readonly Address[] | undefined
  onSubmit: SubmitHandler<TokenFormValues>
}

type TokenSelectMode = "inputToken" | "outputToken" | null

export type TokenFormValues = {
  amountIn: string
  amountOut: string
  inputToken: Address
  outputToken: Address
}

const TokenForm: FC<TokenFormProps> = ({
  isLoadingPreview,
  isLoadingTransaction,
  isWithdraw = false,
  submitText,
  tokenAddreseses,
  onSubmit,
}) => {
  const [tokenSelectMode, setTokenSelectMode] = useState<TokenSelectMode>(null)

  const form = useFormContext<TokenFormValues>()
  const inputTokenAddress = form.watch("inputToken")
  const outputTokenAddress = form.watch("outputToken")

  const isSelectable = tokenAddreseses ? tokenAddreseses.length > 1 : false
  const tokenSelectField = useController({
    name: isWithdraw ? "outputToken" : "inputToken",
    control: form.control,
  })

  const { isConnected } = useAccount()
  const { data: inputTokenBalance, isLoading: isLoadingInputTokenBalance } =
    useTokenOrNativeBalance({ address: inputTokenAddress })
  const { data: inputToken, isLoading: isLoadingInputToken } = useTokenOrNative(
    { address: inputTokenAddress }
  )

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="grid-row-[1fr,auto,max-content] grid w-full grid-cols-[auto,auto] rounded-md">
        {/* inputToken input */}
        <input
          className="peer relative z-[2] col-start-1 row-start-1 block w-full text-ellipsis bg-transparent px-4 pt-4 pb-2 text-2xl placeholder-white/50 focus:outline-none md:text-4xl"
          step="any"
          type="number"
          placeholder="0.0"
          {...form.register("amountIn", {
            validate: {
              positive: (amount) => Number(amount) > 0 || "Enter an amount",
              lessThanBalance: (amount) =>
                parseUnits(amount, inputToken?.decimals).lte(
                  inputTokenBalance?.value ?? 0
                ) || `Insufficient ${inputToken?.symbol ?? ""} balance`,
            },
          })}
        />
        {/* inputToken select button */}
        <div className="relative z-[1] col-start-2 row-start-1 flex items-start justify-self-end pr-4 pt-4">
          <TokenSelectButton
            canChange={!isWithdraw && isConnected && isSelectable}
            tokenAddress={inputTokenAddress}
            onClick={() => setTokenSelectMode("inputToken")}
          />
        </div>

        {/* outputToken input */}
        <input
          className={clsxm(
            "peer relative z-[2] col-start-1 row-start-3 block w-full text-ellipsis bg-transparent px-4 pb-4 pt-1 text-xl text-white/60 placeholder-white/50 focus:outline-none",
            { "animate-pulse": isLoadingPreview }
          )}
          step="any"
          type="number"
          placeholder="0.0"
          disabled={true}
          {...form.register("amountOut")}
        />
        {/* outputToken select button */}
        <div className="relative z-[1] col-start-2 row-start-3 flex items-start space-x-1 justify-self-end pr-4 pb-4">
          <TokenSelectButton
            canChange={isWithdraw && isConnected && isSelectable}
            tokenAddress={outputTokenAddress}
            onClick={() => setTokenSelectMode("outputToken")}
          />
        </div>

        {/* Focus styles */}
        <div
          className="col-span-full col-start-1 row-span-3 row-start-1 rounded-md bg-white/10 peer-focus:outline peer-focus:outline-white/30"
          aria-hidden="true"
        />

        {/* Submit button (or Connect Wallet if not connected) */}
        {isConnected ? (
          <Button
            className="col-span-full mt-3 grid"
            disabled={!form.formState.isValid}
            isLoading={
              isLoadingInputToken ||
              isLoadingInputTokenBalance ||
              isLoadingTransaction
            }
            type="submit"
          >
            {form.formState.isDirty
              ? form.formState.isValid
                ? submitText
                : form.formState.errors.amountIn?.message ?? "Unknown error"
              : "Enter an amount"}
          </Button>
        ) : (
          <ConnectWalletButton className="col-span-full mt-3 w-full" />
        )}

        {/* Token selection modal */}
        <TokenSelectModal
          controller={tokenSelectField}
          isOpen={tokenSelectMode !== null}
          onClose={() => setTokenSelectMode(null)}
          tokenAddresses={tokenAddreseses}
        />
      </div>
    </form>
  )
}

export default TokenForm
