import { FC, useState } from "react"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi"
import { shallow } from "zustand/shallow"

import { fortLog } from "@/lib/fortLog"
import { parseCurrencyUnits } from "@/lib/helpers"
import {
  useActiveChainId,
  useDebouncedValue,
  useInvalidateHoldingsVaults,
  usePreviewRedeem,
  useTokenOrNative,
  useTokenOrNativeBalance,
} from "@/hooks"
import { useVaultContract } from "@/hooks/lib/useVaultContract"

import {
  ConfirmTransactionModal,
  InvalidMinAmountModal,
} from "@/components/Modal"
import TokenForm, { TokenFormValues } from "@/components/TokenForm/TokenForm"
import { VaultDepositWithdrawProps } from "@/components/VaultRow/lib"

import { useGlobalStore, useToastStore } from "@/store"

export const VaultWithdrawForm: FC<VaultDepositWithdrawProps> = ({
  defaultInputToken,
  defaultOutputToken,
  underlyingAssets,
  ...props
}) => {
  const [addToast, replaceToast] = useToastStore(
    (state) => [state.addToast, state.replaceToast],
    shallow
  )

  const [showConfirmWithdrawModal, setShowConfirmWithdraw] = useState(false)
  const [showInvalidMinAmountModal, setShowInvalidMinAmountModal] =
    useState(false)

  const chainId = useActiveChainId()
  const { address: userAddress } = useAccount()
  const expertMode = useGlobalStore((store) => store.expertMode)

  const invalidateHoldingsVaults = useInvalidateHoldingsVaults()

  // Configure form
  const form = useForm<TokenFormValues>({
    defaultValues: {
      amountIn: "",
      inputToken: defaultInputToken,
      outputToken: defaultOutputToken,
    },
    mode: "all",
    reValidateMode: "onChange",
  })

  // Watch form values
  const amountIn = form.watch("amountIn")
  const [amountInDebounced, isDebounced] = useDebouncedValue(amountIn, 500, [
    amountIn,
  ])
  const outputTokenAddress = form.watch("outputToken")
  // Calculate + fetch information on selected tokens
  const outputIsLp = outputTokenAddress === defaultOutputToken
  const { data: inputToken } = useTokenOrNative({ address: defaultInputToken })

  const inputTokenBalance = useTokenOrNativeBalance({
    address: defaultInputToken,
  })
  const outputTokenBalance = useTokenOrNativeBalance({
    address: outputTokenAddress,
  })

  // preview redeem currently returns a value with slippage accounted for; no math is required here
  const value = parseCurrencyUnits({
    amountFormatted: amountInDebounced,
    decimals: inputToken?.decimals,
  })

  const onWithdrawSuccess = () => {
    form.resetField("amountIn")
    invalidateHoldingsVaults()
    inputTokenBalance.refetch()
    outputTokenBalance.refetch()
  }

  // Preview redeem method
  const previewRedeem = usePreviewRedeem({
    ...props,
    chainId,
    token: outputTokenAddress,
    amount: value.toString(),
    enabled: value.gt(0),
  })

  const vaultContract = useVaultContract(defaultInputToken)
  // Enable/disable prepare hooks based on form state
  const enablePrepareTx =
    !form.formState.isValidating &&
    form.formState.isValid &&
    !previewRedeem.isFetching &&
    value.gt(0)
  const enableRedeem = enablePrepareTx && outputIsLp
  const enableRedeemUnderlying = enablePrepareTx && !outputIsLp

  // Configure redeem method
  const prepareRedeem = usePrepareContractWrite({
    ...vaultContract,
    functionName: "redeem",
    enabled: enableRedeem,
    args: [value, userAddress ?? "0x", userAddress ?? "0x"],
  })
  const redeem = useContractWrite(prepareRedeem.config)
  const waitRedeem = useWaitForTransaction({
    hash: redeem.data?.hash,
    // TODO: wagmiv1 onSuccess
    onSuccess: () => onWithdrawSuccess(),
  })

  // Configure redeemUnderlying method
  const prepareRedeemUnderlying = usePrepareContractWrite({
    ...vaultContract,
    functionName: "redeemUnderlying",
    enabled: enableRedeemUnderlying && previewRedeem.isSuccess,
    args: [
      outputTokenAddress,
      userAddress ?? "0x",
      userAddress ?? "0x",
      value,
      BigInt(previewRedeem.data?.minAmountWei ?? "0"),
    ],
  })
  const redeemUnderlying = useContractWrite(prepareRedeemUnderlying.config)
  const waitRedeemUnderlying = useWaitForTransaction({
    hash: redeemUnderlying.data?.hash,
    // TODO: wagmiv1 onSuccess
    onSuccess: () => onWithdrawSuccess(),
  })

  const onSubmitForm: SubmitHandler<TokenFormValues> = async () => {
    if (!outputIsLp && !previewRedeem.data?.minAmountWei) {
      setShowInvalidMinAmountModal(true)
    } else if (expertMode) {
      onConfirmTransactionDetails()
    } else {
      setShowConfirmWithdraw(true)
    }
  }

  const onConfirmTransactionDetails = () => {
    if (enableRedeem) {
      fortLog("Redeeming", amountInDebounced)
      const action = "Vault withdrawal"
      const toastId = addToast({ type: "startTx", action })
      redeem
        .writeAsync?.()
        .then((receipt) => {
          // this fires after the transaction has been broadcast successfully
          setShowConfirmWithdraw(false)
          replaceToast(toastId, { type: "waitTx", hash: receipt.hash, action })
        })
        .catch((error) =>
          replaceToast(toastId, { type: "errorWrite", error, action })
        )
    } else if (enableRedeemUnderlying) {
      fortLog("Redeeming underlying tokens", amountInDebounced)
      const action = "Vault withdrawal"
      const toastId = addToast({ type: "startTx", action })
      redeemUnderlying
        .writeAsync?.()
        .then((receipt) => {
          // this fires after the transaction has been broadcast successfully
          setShowConfirmWithdraw(false)
          replaceToast(toastId, { type: "waitTx", hash: receipt.hash, action })
        })
        .catch((error) =>
          replaceToast(toastId, { type: "errorWrite", error, action })
        )
    }
  }

  return (
    <div className="p-3 md:rounded-md md:bg-pink-100/10 lg:p-4">
      <h2 className="mb-3 text-center font-medium text-pink-100 max-md:hidden">
        Withdraw
      </h2>
      <FormProvider {...form}>
        <TokenForm
          isWithdraw
          isDebouncing={!!amountIn && !isDebounced}
          isError={prepareRedeem.isError || prepareRedeemUnderlying.isError}
          isLoadingPreview={previewRedeem.isFetching}
          isLoadingTransaction={
            prepareRedeem.isLoading ||
            prepareRedeemUnderlying.isLoading ||
            redeem.isLoading ||
            redeemUnderlying.isLoading ||
            waitRedeem.isLoading ||
            waitRedeemUnderlying.isLoading ||
            previewRedeem.isFetching
          }
          onSubmit={onSubmitForm}
          previewResultWei={previewRedeem.data?.resultWei}
          submitText="Withdraw"
          asset={defaultOutputToken}
          tokenAddresses={underlyingAssets}
          productType={props.productType}
        />
      </FormProvider>

      <ConfirmTransactionModal
        isOpen={showConfirmWithdrawModal}
        onClose={() => setShowConfirmWithdraw(false)}
        onConfirm={onConfirmTransactionDetails}
        inputAmount={value.toString()}
        inputTokenAddress={defaultInputToken}
        outputAmount={previewRedeem.data?.resultWei}
        outputAmountMin={
          outputIsLp
            ? previewRedeem.data?.resultWei
            : previewRedeem.data?.minAmountWei
        }
        outputTokenAddress={outputTokenAddress}
        isLoading={previewRedeem.isFetching}
        isPreparing={prepareRedeem.isFetching}
        isWaitingForSignature={redeem.isLoading || redeemUnderlying.isLoading}
        productType={props.productType}
        type="withdraw"
      />

      <InvalidMinAmountModal
        isOpen={showInvalidMinAmountModal}
        onClose={() => setShowInvalidMinAmountModal(false)}
        type="withdraw"
      />
    </div>
  )
}
