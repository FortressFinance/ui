import { BigNumber } from "ethers"
import { FC, useState } from "react"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  UserRejectedRequestError,
  useWaitForTransaction,
} from "wagmi"

import { fortLog } from "@/lib/fortLog"
import { parseCurrencyUnits } from "@/lib/helpers"
import { VaultProps } from "@/lib/types"
import {
  useActiveChainId,
  useInvalidateHoldingsVaults,
  usePreviewRedeem,
  useTokenOrNative,
  useVault,
  useVaultPoolId,
} from "@/hooks"
import { useVaultContract } from "@/hooks/lib/useVaultContract"
import useDebounce from "@/hooks/useDebounce"
import { useToast } from "@/hooks/useToast"

import { ConfirmTransactionModal } from "@/components/Modal"
import TokenForm, { TokenFormValues } from "@/components/TokenForm/TokenForm"

export const VaultWithdrawForm: FC<VaultProps> = (props) => {
  const [showConfirmWithdrawModal, setShowConfirmWithdraw] = useState(false)

  const { data: poolId } = useVaultPoolId(props)
  const chainId = useActiveChainId()
  const { address: userAddress } = useAccount()
  const vault = useVault(props)
  const toastManager = useToast()

  const underlyingAssets = vault.data?.underlyingAssets

  const invalidateHoldingsVaults = useInvalidateHoldingsVaults()

  // Configure form
  const form = useForm<TokenFormValues>({
    defaultValues: {
      amountIn: "",
      inputToken: props.vaultAddress,
      outputToken: props.asset,
    },
    mode: "all",
    reValidateMode: "onChange",
  })

  // Watch form values
  const amountIn = form.watch("amountIn")
  const amountInDebounced = useDebounce(amountIn)
  const outputTokenAddress = form.watch("outputToken")
  // Calculate + fetch information on selected tokens
  const outputIsLp = outputTokenAddress === props.asset
  const { data: inputToken } = useTokenOrNative({ address: props.vaultAddress })

  // preview redeem currently returns a value with slippage accounted for; no math is required here
  const value = parseCurrencyUnits({
    amountFormatted: amountInDebounced,
    decimals: inputToken?.decimals,
  })

  const onWithdrawSuccess = () => {
    form.resetField("amountIn")
    invalidateHoldingsVaults()
  }

  // Preview redeem method
  const previewRedeem = usePreviewRedeem({
    chainId,
    id: poolId,
    token: outputTokenAddress,
    amount: value.toString(),
    type: props.type,
    enabled: value.gt(0),
  })

  const vaultContract = useVaultContract(props.vaultAddress)
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
    onSettled: (receipt, error) =>
      error
        ? toastManager.error(
            "Withdraw transaction failed.",
            receipt?.transactionHash
          )
        : toastManager.success(
            "Withdraw transaction done successfully.",
            receipt?.transactionHash
          ),
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
      BigNumber.from(previewRedeem.data?.minAmountWei ?? "0"),
    ],
  })
  const redeemUnderlying = useContractWrite(prepareRedeemUnderlying.config)
  const waitRedeemUnderlying = useWaitForTransaction({
    hash: redeemUnderlying.data?.hash,
    onSettled: (receipt, error) =>
      error
        ? toastManager.error(
            "Withdraw transaction failed.",
            receipt?.transactionHash
          )
        : toastManager.success(
            "Withdraw transaction done successfully.",
            receipt?.transactionHash
          ),
    onSuccess: () => onWithdrawSuccess(),
  })

  // Form submit handler
  const onSubmitForm: SubmitHandler<TokenFormValues> = async () => {
    if (enableRedeem) {
      fortLog("Redeeming", amountInDebounced)
      const redeemWaitingForSigner = toastManager.loading(
        "Waiting for signature..."
      )
      redeem
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
        .finally(() => toast.dismiss(redeemWaitingForSigner))
    }
    if (enableRedeemUnderlying) {
      fortLog("Redeeming underlying tokens", amountInDebounced)
      const redeemUnderlyingWaitingForSigner = toastManager.loading(
        "Waiting for signature..."
      )
      redeemUnderlying
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
        .finally(() => toast.dismiss(redeemUnderlyingWaitingForSigner))
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
          isDebouncing={amountIn !== amountInDebounced}
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
          asset={props.asset}
          tokenAddresses={underlyingAssets}
        />
      </FormProvider>

      <ConfirmTransactionModal
        isOpen={showConfirmWithdrawModal}
        onClose={() => setShowConfirmWithdraw(false)}
        onConfirm={enableRedeem ? redeem.write : redeemUnderlying.write}
        inputAmount={value.toString()}
        inputTokenAddress={props.vaultAddress}
        outputAmount={previewRedeem.data?.resultWei}
        outputAmountMin={previewRedeem.data?.minAmountWei}
        outputTokenAddress={outputTokenAddress}
        isPreparing={prepareRedeem.isFetching}
        isWaitingForSignature={redeem.isLoading || redeemUnderlying.isLoading}
        type="deposit"
      />
    </div>
  )
}
