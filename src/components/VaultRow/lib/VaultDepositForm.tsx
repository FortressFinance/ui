import { BigNumber, ethers } from "ethers"
import { FC, useState } from "react"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import {
  Address,
  erc20ABI,
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  UserRejectedRequestError,
  useWaitForTransaction,
} from "wagmi"

import { fortLog } from "@/lib/fortLog"
import { parseCurrencyUnits } from "@/lib/helpers"
import isEthTokenAddress from "@/lib/isEthTokenAddress"
import {
  useActiveChainId,
  useInvalidateHoldingsVaults,
  usePreviewDeposit,
  useTokenOrNative,
  useTokenOrNativeBalance,
} from "@/hooks"
import { useVaultContract } from "@/hooks/lib/useVaultContract"
import useDebounce from "@/hooks/useDebounce"
import { useToast } from "@/hooks/useToast"

import {
  ConfirmTransactionModal,
  InvalidMinAmountModal,
} from "@/components/Modal"
import TokenForm, { TokenFormValues } from "@/components/TokenForm/TokenForm"
import { VaultRowPropsWithProduct } from "@/components/VaultRow/VaultRow"

import { useGlobalStore } from "@/store"

export type VaultDepositWithdrawProps = VaultRowPropsWithProduct & {
  inputToken: Address
  outputToken: Address
  underlyingAssets: Address[] | readonly Address[] | undefined
}

export const VaultDepositForm: FC<VaultDepositWithdrawProps> = ({
  inputToken,
  outputToken,
  underlyingAssets,
  ...props
}) => {
  const [showConfirmDepositModal, setShowConfirmDepositModal] = useState(false)
  const [showInvalidMinAmountModal, setShowInvalidMinAmountModal] =
    useState(false)

  const { address: userAddress } = useAccount()
  const chainId = useActiveChainId()
  const toastManager = useToast()
  const expertMode = useGlobalStore((store) => store.expertMode)

  const invalidateHoldingsVaults = useInvalidateHoldingsVaults()

  // Configure form
  const form = useForm<TokenFormValues>({
    defaultValues: {
      amountIn: "",
      inputToken,
      outputToken,
    },
    mode: "all",
    reValidateMode: "onChange",
  })

  // Watch form values
  const amountIn = form.watch("amountIn")
  const amountInDebounced = useDebounce(amountIn, 500)
  const inputTokenAddress = form.watch("inputToken")
  // Calculate + fetch information on selected tokens
  const inputIsLp = inputTokenAddress === inputToken
  const inputIsEth = isEthTokenAddress(inputTokenAddress)
  const { data: inputCurrency } = useTokenOrNative({
    address: inputTokenAddress,
  })

  const inputTokenBalance = useTokenOrNativeBalance({
    address: inputTokenAddress,
  })
  const outputTokenBalance = useTokenOrNativeBalance({
    address: outputToken,
  })

  // preview redeem currently returns a value with slippage accounted for; no math is required here
  const value = parseCurrencyUnits({
    amountFormatted: amountInDebounced,
    decimals: inputCurrency?.decimals,
  })

  // Check token approval if necessary
  const allowance = useContractRead({
    chainId,
    abi: erc20ABI,
    address: inputTokenAddress,
    functionName: "allowance",
    args: [userAddress ?? "0x", outputToken],
    enabled: !!userAddress && !inputIsEth,
  })
  const requiresApproval = inputIsEth ? false : allowance.data?.lt(value)

  const onDepositSuccess = () => {
    form.resetField("amountIn")
    invalidateHoldingsVaults()
    inputTokenBalance.refetch()
    outputTokenBalance.refetch()
  }

  // Configure approve method
  const prepareApprove = usePrepareContractWrite({
    chainId,
    abi: erc20ABI,
    address: inputTokenAddress,
    functionName: "approve",
    args: [outputToken, ethers.constants.MaxUint256],
    enabled: requiresApproval,
  })
  const approve = useContractWrite(prepareApprove.config)
  const waitApprove = useWaitForTransaction({
    hash: approve.data?.hash,
    onSettled: (receipt, error) =>
      error
        ? toastManager.error(
            "Approve transaction failed.",
            receipt?.transactionHash
          )
        : toastManager.success(
            "Approve transaction done successfully.",
            receipt?.transactionHash
          ),
    onSuccess: () => allowance.refetch(),
  })

  const previewDeposit = usePreviewDeposit({
    ...props,
    chainId,
    token: inputTokenAddress,
    amount: value.toString(),
    enabled: value.gt(0),
  })

  const vaultContract = useVaultContract(outputToken)
  // Enable prepare hooks accordingly
  const enablePrepareTx =
    !form.formState.isValidating &&
    form.formState.isValid &&
    !previewDeposit.isFetching &&
    value.gt(0)
  const enableDeposit = enablePrepareTx && !requiresApproval && inputIsLp
  const enableDepositUnderlying =
    enablePrepareTx && !requiresApproval && !inputIsLp

  // Configure depositLp method
  const prepareDeposit = usePrepareContractWrite({
    ...vaultContract,
    functionName: "deposit",
    enabled: enableDeposit,
    args: [value, userAddress ?? "0x"],
  })
  const deposit = useContractWrite(prepareDeposit.config)
  const waitDeposit = useWaitForTransaction({
    hash: deposit.data?.hash,
    onSettled: (receipt, error) =>
      error
        ? toastManager.error(
            "Deposit transaction failed.",
            receipt?.transactionHash
          )
        : toastManager.success(
            "Deposit transaction done successfully.",
            receipt?.transactionHash
          ),
    onSuccess: () => onDepositSuccess(),
  })

  // Configure depositUnderlying method
  const prepareDepositUnderlying = usePrepareContractWrite({
    ...vaultContract,
    functionName: "depositUnderlying",
    enabled: enableDepositUnderlying && previewDeposit.isSuccess,
    args: [
      inputTokenAddress,
      userAddress ?? "0x",
      value,
      BigNumber.from(previewDeposit.data?.minAmountWei ?? "0"),
    ],
    overrides: { value: inputIsEth ? value : BigNumber.from(0) },
  })
  const depositUnderlying = useContractWrite(prepareDepositUnderlying.config)
  const waitDepositUnderlying = useWaitForTransaction({
    hash: depositUnderlying.data?.hash,
    onSettled: (receipt, error) =>
      error
        ? toastManager.error(
            "Deposit transaction failed.",
            receipt?.transactionHash
          )
        : toastManager.success(
            "Deposit transaction done successfully.",
            receipt?.transactionHash
          ),
    onSuccess: () => onDepositSuccess(),
  })

  // Form submit handler
  const onSubmitForm: SubmitHandler<TokenFormValues> = async () => {
    if (requiresApproval) {
      const approveWaitingForSigner = toastManager.loading(
        "Waiting for signature..."
      )
      approve
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
        .finally(() => toast.dismiss(approveWaitingForSigner))
    } else {
      if (!inputIsLp && !previewDeposit.data?.minAmountWei) {
        setShowInvalidMinAmountModal(true)
      } else if (expertMode) {
        onConfirmTransactionDetails()
      } else {
        setShowConfirmDepositModal(true)
      }
    }
  }

  const onConfirmTransactionDetails = () => {
    if (enableDeposit) {
      fortLog("Depositing", amountInDebounced)
      const depositWaitingForSigner = toastManager.loading(
        "Waiting for signature..."
      )
      deposit
        .writeAsync?.()
        .then((receipt) => {
          // this fires after the transaction has been broadcast successfully
          setShowConfirmDepositModal(false)
          toastManager.loading(
            "Waiting for transaction confirmation...",
            receipt.hash
          )
        })
        .catch((err) =>
          // this fires after a failure to broadcast the transaction
          toastManager.error(
            err instanceof UserRejectedRequestError
              ? "User rejected request"
              : "Error broadcasting transaction"
          )
        )
        .finally(() => toast.dismiss(depositWaitingForSigner))
    } else if (enableDepositUnderlying) {
      fortLog("Depositing underlying tokens", amountInDebounced)
      const depositUnderlyngWaitingForSigner = toastManager.loading(
        "Waiting for signature..."
      )
      depositUnderlying
        .writeAsync?.()
        .then((receipt) => {
          // this fires after the transaction has been broadcast successfully
          setShowConfirmDepositModal(false)
          toastManager.loading(
            "Waiting for transaction confirmation...",
            receipt.hash
          )
        })
        .catch((err) =>
          // this fires after a failure to broadcast the transaction
          toastManager.error(
            err instanceof UserRejectedRequestError
              ? "User rejected request"
              : "Error broadcasting transaction"
          )
        )
        .finally(() => toast.dismiss(depositUnderlyngWaitingForSigner))
    }
  }

  return (
    <div className="p-3 md:rounded-md md:bg-pink-100/10 lg:p-4">
      <h2 className="mb-3 text-center font-medium text-pink-100 max-md:hidden">
        Deposit
      </h2>
      <FormProvider {...form}>
        <TokenForm
          isDebouncing={amountIn !== amountInDebounced}
          isError={prepareDeposit.isError || prepareDepositUnderlying.isError}
          isLoadingPreview={previewDeposit.isFetching}
          isLoadingTransaction={
            (amountInDebounced && allowance.isFetching) ||
            prepareApprove.isLoading ||
            prepareDeposit.isLoading ||
            prepareDepositUnderlying.isLoading ||
            approve.isLoading ||
            deposit.isLoading ||
            depositUnderlying.isLoading ||
            waitApprove.isLoading ||
            waitDeposit.isLoading ||
            waitDepositUnderlying.isLoading ||
            previewDeposit.isFetching
          }
          onSubmit={onSubmitForm}
          submitText={requiresApproval ? "Approve" : "Deposit"}
          previewResultWei={previewDeposit.data?.resultWei}
          asset={inputToken}
          tokenAddresses={underlyingAssets}
        />
      </FormProvider>

      <ConfirmTransactionModal
        isOpen={showConfirmDepositModal}
        onClose={() => setShowConfirmDepositModal(false)}
        onConfirm={onConfirmTransactionDetails}
        inputAmount={value.toString()}
        inputTokenAddress={inputTokenAddress}
        outputAmount={previewDeposit.data?.resultWei}
        outputAmountMin={
          inputIsLp
            ? previewDeposit.data?.resultWei
            : previewDeposit.data?.minAmountWei
        }
        outputTokenAddress={outputToken}
        isLoading={previewDeposit.isFetching}
        isPreparing={prepareDeposit.isFetching}
        isWaitingForSignature={deposit.isLoading || depositUnderlying.isLoading}
        type="deposit"
      />

      <InvalidMinAmountModal
        isOpen={showInvalidMinAmountModal}
        onClose={() => setShowInvalidMinAmountModal(false)}
        type="deposit"
      />
    </div>
  )
}
