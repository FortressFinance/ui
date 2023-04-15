import { FC } from "react"
import { FormProvider, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { Address, UserRejectedRequestError } from "wagmi"

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

import Skeleton from "@/components/Skeleton"
import TokenForm, { TokenFormValues } from "@/components/TokenForm/TokenForm"

type LendingPairProps = {
  pairAddress: Address
}

export const LendingPair: FC<LendingPairProps> = ({ pairAddress }) => {
  const lendingPair = useLendingPair({ pairAddress })
  const share = useTokenOrNative({ address: pairAddress })

  return (
    <div className="rounded-lg bg-pink-900/80 p-3 backdrop-blur-md lg:p-6">
      <h1>
        <Skeleton isLoading={share.isLoading}>
          {share.data?.name ?? "Loading lending pair..."}
        </Skeleton>
      </h1>
      <div className="mt-6 grid grid-cols-2 gap-4">
        <LendingPairDeposit
          pairAddress={pairAddress}
          assetAddress={lendingPair.data?.assetContract}
        />
        <LendingPairRedeem
          pairAddress={pairAddress}
          assetAddress={lendingPair.data?.assetContract}
        />
      </div>
    </div>
  )
}

type LendingPairInteractionProps = {
  pairAddress: Address
  assetAddress?: Address
}

const LendingPairDeposit: FC<LendingPairInteractionProps> = ({
  pairAddress,
  assetAddress,
}) => {
  const toastManager = useToast()
  const asset = useTokenOrNative({ address: assetAddress })

  const form = useForm<TokenFormValues>({
    defaultValues: {
      amountIn: "0",
      inputToken: assetAddress,
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
    amount: depositValue,
    spender: pairAddress,
    token: assetAddress,
    enabled: form.formState.isValid,
  })
  const preview = useLendingDepositPreview({
    pairAddress,
    amount: depositValue,
    enabled: form.formState.isValid,
  })
  const deposit = useLendingDeposit({
    pairAddress,
    assetAddress,
    amount: depositValue,
    enabled: form.formState.isValid && approval.isSufficient,
    onSuccess: () => {
      form.resetField("amountIn")
    },
  })

  return (
    <FormProvider {...form}>
      <div className="p-3 md:rounded-md md:bg-pink-100/10 lg:p-4">
        <h2 className="mb-3 text-center font-medium text-pink-100 max-md:hidden">
          Deposit
        </h2>
        <TokenForm
          asset={assetAddress}
          submitText={approval.isSufficient ? "Lend" : "Approve"}
          isDebouncing={amountIn !== amountInDebounced}
          isError={
            preview.isError ||
            approval.prepare.isError ||
            deposit.prepare.isError
          }
          isLoadingPreview={preview.isLoading}
          isLoadingTransaction={
            approval.wait.isLoading || deposit.wait.isLoading
          }
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
      </div>
    </FormProvider>
  )
}

const LendingPairRedeem: FC<LendingPairInteractionProps> = ({
  pairAddress,
  assetAddress,
}) => {
  const toastManager = useToast()
  const share = useTokenOrNative({ address: pairAddress })

  const form = useForm<TokenFormValues>({
    defaultValues: {
      amountIn: "0",
      inputToken: pairAddress,
      outputToken: assetAddress,
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
    amount: redeemValue,
    enabled: form.formState.isValid,
  })
  const redeem = useLendingRedeem({
    pairAddress,
    assetAddress,
    amount: redeemValue,
    enabled: form.formState.isValid,
    onSuccess: () => form.resetField("amountIn"),
  })

  return (
    <FormProvider {...form}>
      <div className="p-3 md:rounded-md md:bg-pink-100/10 lg:p-4">
        <h2 className="mb-3 text-center font-medium text-pink-100 max-md:hidden">
          Withdraw
        </h2>
        <TokenForm
          asset={assetAddress}
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
      </div>
    </FormProvider>
  )
}
