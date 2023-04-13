import * as Dialog from "@radix-ui/react-dialog"
import { FC, useEffect, useState } from "react"
import { Address } from "wagmi"

import clsxm from "@/lib/clsxm"
import { formatCurrencyUnits, localeNumber } from "@/lib/helpers"
import { useTokenOrNative } from "@/hooks"

import { AssetLogo, AssetSymbol } from "@/components/Asset"
import Button from "@/components/Button"
import { ModalBaseProps } from "@/components/Modal/lib/ModalBase"
import PurpleModal, {
  PurpleModalContent,
  PurpleModalHeader,
} from "@/components/Modal/lib/PurpleModal"

import { FortIconCloseCircle, FortIconWarning } from "@/icons"

import { useGlobalStore } from "@/store"

type ConfirmTransactionModalProps = ModalBaseProps & {
  onConfirm?: () => void
  inputAmount: string
  inputTokenAddress: Address
  outputAmount?: string
  outputAmountMin?: string
  outputTokenAddress: Address
  isLoading: boolean
  isPreparing: boolean
  isWaitingForSignature: boolean
  type: "deposit" | "withdraw"
}

export const ConfirmTransactionModal: FC<ConfirmTransactionModalProps> = ({
  onConfirm,
  inputAmount,
  inputTokenAddress,
  outputAmount,
  outputAmountMin,
  outputTokenAddress,
  isLoading,
  isPreparing,
  isWaitingForSignature,
  type,
  ...modalProps
}) => {
  const slippageTolerance = useGlobalStore((store) => store.slippageTolerance)
  const isUnusualSlippage = slippageTolerance <= 0 || slippageTolerance >= 2
  const [sanityChecked, setSanityChecked] = useState(!isUnusualSlippage)

  const inputToken = useTokenOrNative({ address: inputTokenAddress })
  const outputToken = useTokenOrNative({ address: outputTokenAddress })

  const formattedAmount = (amount?: string, decimals?: number) =>
    localeNumber(Number(formatCurrencyUnits({ amountWei: amount, decimals })))

  // Reset sanity check when modal opens
  useEffect(() => {
    if (modalProps.isOpen) setSanityChecked(!isUnusualSlippage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalProps.isOpen])

  return (
    <PurpleModal className="max-w-sm" {...modalProps}>
      <PurpleModalHeader className="flex justify-between space-x-4">
        <Dialog.Title className="text-xl">
          {outputAmountMin ? `Confirm ${type}` : `Unable to ${type}`}
        </Dialog.Title>
        <Dialog.Close>
          <FortIconCloseCircle className="h-7 w-7" />
          <span className="sr-only">Close</span>
        </Dialog.Close>
      </PurpleModalHeader>

      <PurpleModalContent className="grid grid-cols-1 space-y-4 divide-pink-800">
        <div className="space-y-2">
          <div className="overflow-hidden rounded border border-pink-700 bg-pink-800/50">
            <div className="col-span-full mb-2 flex items-center justify-start gap-2 px-3 pt-3 text-xs text-pink-200">
              <AssetLogo className="h-5 w-5" tokenAddress={inputTokenAddress} />
              <span>
                {type === "deposit" ? "Deposit" : "Redeem"} /{" "}
                <strong>
                  <AssetSymbol address={inputTokenAddress} />
                </strong>
              </span>
            </div>
            <input
              className="w-full bg-transparent px-3 pb-3 text-3xl text-pink-50"
              value={formattedAmount(inputAmount, inputToken.data?.decimals)}
              type="text"
              disabled
            />
          </div>
          <div className="overflow-hidden rounded border border-pink-700 bg-pink-800/50">
            <div className="col-span-full mb-2 flex items-center justify-start gap-2 px-3 pt-3 text-xs text-pink-200">
              <AssetLogo
                className="h-5 w-5"
                tokenAddress={outputTokenAddress}
              />
              <span>
                Receive /{" "}
                <strong>
                  <AssetSymbol address={outputTokenAddress} />
                </strong>
              </span>
            </div>
            <input
              className={clsxm(
                "w-full bg-transparent px-3 pb-3 text-3xl text-pink-50",
                { "animate-pulse": isLoading || isPreparing }
              )}
              value={formattedAmount(outputAmount, outputToken.data?.decimals)}
              type="text"
              disabled
            />
          </div>
        </div>
        <dl
          className={clsxm(
            "grid grid-cols-[max-content,1fr] border-y border-t-pink-300 py-3 text-xs leading-loose text-pink-100",
            {
              "animate-pulse": isLoading || isPreparing,
              "font-semibold text-red-500": isUnusualSlippage,
            }
          )}
        >
          <dt>Expected output</dt>
          <dd className="text-right">
            {formattedAmount(outputAmount, outputToken.data?.decimals)}{" "}
            <AssetSymbol address={outputTokenAddress} />
          </dd>
          <dt>Minimum received</dt>
          <dd className="text-right">
            {outputAmountMin
              ? formattedAmount(outputAmountMin, outputToken.data?.decimals)
              : "0.000"}{" "}
            <AssetSymbol address={outputTokenAddress} />
          </dd>
          <dt>Slippage tolerance</dt>
          <dd className="text-right">{slippageTolerance}%</dd>
        </dl>
        {isUnusualSlippage && (
          <>
            <div className="flex items-center justify-center gap-3">
              <FortIconWarning className="h-6 w-6 fill-red-500" />
              <span className="font-bold text-red-500">
                Unusual slippage detected
              </span>
            </div>
            <p className="mt-3 text-center text-xs">
              You will probably lose money if you proceed.
            </p>
          </>
        )}
        {sanityChecked ? (
          <Button
            onClick={onConfirm}
            disabled={isLoading || isPreparing}
            isLoading={isLoading || isPreparing || isWaitingForSignature}
          >
            Confirm {type}
          </Button>
        ) : (
          <Button
            className="mt-4 w-full bg-red-500"
            variant="plain"
            disabled={isLoading || isPreparing}
            isLoading={isLoading || isPreparing}
            onClick={() => setSanityChecked(true)}
          >
            I understand, continue
          </Button>
        )}
      </PurpleModalContent>
    </PurpleModal>
  )
}
