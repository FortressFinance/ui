import { ethers } from "ethers"
import { FC } from "react"
import { FormProvider, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { UserRejectedRequestError } from "wagmi"

import { parseCurrencyUnits } from "@/lib/helpers"
import {
  useLendingDeposit,
  useLendingDepositPreview,
  useLendingPair,
  useLendingRedeem,
  useLendingRedeemPreview,
  useTokenApproval,
  useTokenOrNative,
} from "@/hooks"
import useDebounce from "@/hooks/useDebounce"
import { useToast } from "@/hooks/useToast"

import TokenForm, { TokenFormValues } from "@/components/TokenForm/TokenForm"

import { LendingPair } from "@/constant"

export const LendingPairDepositForm: FC<LendingPair> = ({
  pairAddress,
  chainId,
}) => {
  const toastManager = useToast()
  const lendingPair = useLendingPair({ pairAddress, chainId })
  const asset = useTokenOrNative({
    address: lendingPair.data?.assetContract,
    chainId,
  })

  const form = useForm<TokenFormValues>({
    values: {
      amountIn: "",
      inputToken: lendingPair.data?.assetContract ?? "0x",
      outputToken: pairAddress,
    },
  })
  const amountIn = form.watch("amountIn")
  const amountInDebounced = useDebounce(amountIn, 500)
  const depositValue = parseCurrencyUnits({
    amountFormatted: amountInDebounced,
    decimals: asset.data?.decimals,
  })

  const approval = useTokenApproval({
    amount: ethers.constants.MaxUint256,
    spender: pairAddress,
    token: lendingPair.data?.assetContract,
    enabled: form.formState.isValid,
  })
  const preview = useLendingDepositPreview({
    pairAddress,
    chainId,
    amount: depositValue,
    enabled: form.formState.isValid,
  })
  const deposit = useLendingDeposit({
    pairAddress,
    chainId,
    assetAddress: lendingPair.data?.assetContract,
    amount: depositValue,
    enabled: form.formState.isValid && approval.isSufficient,
    onSuccess: () => {
      form.resetField("amountIn")
    },
  })

  return (
    <FormProvider {...form}>
      <TokenForm
        asset={lendingPair.data?.assetContract}
        chainId={chainId}
        submitText={approval.isSufficient ? "Lend" : "Approve"}
        isDebouncing={amountIn !== amountInDebounced}
        isError={
          preview.isError || approval.prepare.isError || deposit.prepare.isError
        }
        isLoadingPreview={preview.isLoading}
        isLoadingTransaction={approval.wait.isLoading || deposit.wait.isLoading}
        previewResultWei={preview.data?.toString()}
        onSubmit={() => {
          const waitingForSignature = toastManager.loading(
            "Waiting for signature..."
          )
          if (approval.isSufficient) {
            deposit.write
              .writeAsync?.()
              .then((receipt) =>
                toastManager.loading(
                  "Waiting for transaction confirmation...",
                  receipt.hash
                )
              )
              .catch((err) =>
                toastManager.error(
                  err instanceof UserRejectedRequestError
                    ? "User rejected request"
                    : "Error broadcasting transaction"
                )
              )
              .finally(() => toast.dismiss(waitingForSignature))
          } else {
            approval.write
              .writeAsync?.()
              .then((receipt) =>
                toastManager.loading(
                  "Waiting for transaction confirmation...",
                  receipt.hash
                )
              )
              .catch((err) =>
                toastManager.error(
                  err instanceof UserRejectedRequestError
                    ? "User rejected request"
                    : "Error broadcasting transaction"
                )
              )
              .finally(() => toast.dismiss(waitingForSignature))
          }
        }}
      />
    </FormProvider>
  )
}

export const LendingPairRedeem: FC<LendingPair> = ({
  pairAddress,
  chainId,
}) => {
  const toastManager = useToast()
  const lendingPair = useLendingPair({ pairAddress, chainId })
  const share = useTokenOrNative({ address: pairAddress, chainId })

  const form = useForm<TokenFormValues>({
    defaultValues: {
      amountIn: "",
      inputToken: pairAddress,
      outputToken: lendingPair.data?.assetContract ?? "0x",
    },
  })
  const amountIn = form.watch("amountIn")
  const amountInDebounced = useDebounce(amountIn, 500)
  const redeemValue = parseCurrencyUnits({
    amountFormatted: amountInDebounced,
    decimals: share.data?.decimals,
  })

  const preview = useLendingRedeemPreview({
    pairAddress,
    chainId,
    amount: redeemValue,
    enabled: form.formState.isValid,
  })
  const redeem = useLendingRedeem({
    pairAddress,
    chainId,
    assetAddress: lendingPair.data?.assetContract,
    amount: redeemValue,
    enabled: form.formState.isValid,
    onSuccess: () => form.resetField("amountIn"),
  })

  return (
    <FormProvider {...form}>
      <TokenForm
        asset={lendingPair.data?.assetContract}
        chainId={chainId}
        submitText="Withdraw"
        isDebouncing={amountIn !== amountInDebounced}
        isError={preview.isError || redeem.prepare.isError}
        isLoadingPreview={preview.isLoading}
        isLoadingTransaction={redeem.wait.isLoading}
        previewResultWei={preview.data?.toString()}
        onSubmit={() => {
          const waitingForSignature = toastManager.loading(
            "Waiting for signature..."
          )
          redeem.write
            .writeAsync?.()
            .then((receipt) =>
              toastManager.loading(
                "Waiting for transaction confirmation...",
                receipt.hash
              )
            )
            .catch((err) =>
              toastManager.error(
                err instanceof UserRejectedRequestError
                  ? "User rejected request"
                  : "Error broadcasting transaction"
              )
            )
            .finally(() => toast.dismiss(waitingForSignature))
        }}
      />
    </FormProvider>
  )
}
