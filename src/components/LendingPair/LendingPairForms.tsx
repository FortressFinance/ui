import { FC } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { shallow } from "zustand/shallow"

import { calculateAssetsAvailable } from "@/lib"
import { parseCurrencyUnits } from "@/lib/helpers"
import {
  useConvertToShares,
  useDebouncedValue,
  useLendingDeposit,
  useLendingDepositPreview,
  useLendingPair,
  useLendingRedeem,
  useLendingRedeemPreview,
  usePairLeverParams,
  useTokenApproval,
  useTokenOrNativeBalance,
} from "@/hooks"

import TokenForm, { TokenFormValues } from "@/components/TokenForm/TokenForm"

import { useToastStore } from "@/store"

import { LendingPair } from "@/constant"

export const LendingPairDepositForm: FC<LendingPair> = ({
  pairAddress,
  chainId,
}) => {
  const [addToast, replaceToast] = useToastStore(
    (state) => [state.addToast, state.replaceToast],
    shallow
  )
  const lendingPair = useLendingPair({ pairAddress, chainId })
  const pairLeverParams = usePairLeverParams({ pairAddress, chainId })
  const asset = useTokenOrNativeBalance({
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
  const [amountInDebounced, isDebounced] = useDebouncedValue(amountIn, 500, [
    amountIn,
  ])

  const depositValue = parseCurrencyUnits({
    amountFormatted: amountInDebounced,
    decimals: asset.data?.decimals,
  })

  const approval = useTokenApproval({
    amount: depositValue,
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
      asset.refetch()
      lendingPair.refetch()
      pairLeverParams.refetch()
    },
  })

  return (
    <FormProvider {...form}>
      <TokenForm
        asset={lendingPair.data?.assetContract}
        chainId={chainId}
        submitText={approval.isSufficient ? "Lend" : "Approve"}
        isDebouncing={!!amountIn && !isDebounced}
        isError={preview.isError || deposit.prepare.isError}
        isLoadingPreview={preview.isLoading}
        isLoadingTransaction={approval.wait.isLoading || deposit.wait.isLoading}
        previewResultWei={preview.data?.toString()}
        productType="lending"
        onSubmit={() => {
          if (approval.isSufficient) {
            const action = "Lending asset deposit"
            const toastId = addToast({ type: "startTx", action })
            deposit.write
              .writeAsync?.()
              .then((receipt) =>
                replaceToast(toastId, {
                  type: "waitTx",
                  hash: receipt.hash,
                  action,
                })
              )
              .catch((error) =>
                replaceToast(toastId, { type: "errorWrite", error, action })
              )
          } else {
            const action = "Token approval"
            const toastId = addToast({ type: "startTx", action })
            approval.write
              .writeAsync()
              .then((receipt) =>
                replaceToast(toastId, {
                  type: "waitTx",
                  hash: receipt.hash,
                  action,
                })
              )
              .catch((error) =>
                replaceToast(toastId, { type: "errorWrite", error, action })
              )
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
  const [addToast, replaceToast] = useToastStore(
    (state) => [state.addToast, state.replaceToast],
    shallow
  )
  const lendingPair = useLendingPair({ pairAddress, chainId })
  const pairLeverParams = usePairLeverParams({ pairAddress, chainId })
  const share = useTokenOrNativeBalance({ address: pairAddress, chainId })

  const form = useForm<TokenFormValues>({
    defaultValues: {
      amountIn: "",
      inputToken: pairAddress,
      outputToken: lendingPair.data?.assetContract ?? "0x",
    },
  })
  const amountIn = form.watch("amountIn")
  const [amountInDebounced, isDebounced] = useDebouncedValue(amountIn, 500, [
    amountIn,
  ])

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
    onSuccess: () => {
      form.resetField("amountIn")
      share.refetch()
      lendingPair.refetch()
      pairLeverParams.refetch()
    },
  })

  const maxSharesAvailableToWithdraw = useConvertToShares({
    amount: calculateAssetsAvailable({
      totalAssets: pairLeverParams.data.totalAssets,
      totalBorrowAmount: pairLeverParams.data.totalBorrowAmount,
    }),
    totalBorrowAmount: pairLeverParams.data.totalBorrowAmount,
    totalBorrowShares: pairLeverParams.data.totalBorrowShares,
    pairAddress,
  })

  return (
    <FormProvider {...form}>
      <TokenForm
        isWithdraw
        asset={lendingPair.data?.assetContract}
        chainId={chainId}
        submitText="Redeem"
        isDebouncing={!!amountIn && !isDebounced}
        isError={preview.isError || redeem.prepare.isError}
        isLoadingPreview={preview.isLoading}
        isLoadingTransaction={redeem.wait.isLoading}
        maxAssetAmountLimit={maxSharesAvailableToWithdraw.data}
        previewResultWei={preview.data?.toString()}
        productType="lending"
        onSubmit={() => {
          const action = "Lending asset redemption"
          const toastId = addToast({ type: "startTx", action })
          redeem.write
            .writeAsync?.()
            .then((receipt) =>
              replaceToast(toastId, {
                type: "waitTx",
                hash: receipt.hash,
                action,
              })
            )
            .catch((error) =>
              replaceToast(toastId, { type: "errorWrite", error, action })
            )
        }}
      />
    </FormProvider>
  )
}
