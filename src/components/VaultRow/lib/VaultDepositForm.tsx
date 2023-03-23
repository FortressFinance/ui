import { BigNumber, ethers } from "ethers"
import { parseUnits } from "ethers/lib/utils.js"
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
  useWaitForTransaction,
} from "wagmi"

import { fortLog } from "@/lib/fortLog"
import isEthTokenAddress from "@/lib/isEthTokenAddress"
import { VaultProps } from "@/lib/types"
import {
  useActiveChainId,
  useInvalidateHoldingsVaults,
  usePreviewDeposit,
  useTokenOrNative,
  useVault,
  useVaultPoolId,
} from "@/hooks"
import { useVaultContract } from "@/hooks/lib/useVaultContract"
import useDebounce from "@/hooks/useDebounce"
import { useToast } from "@/hooks/useToast"

import TokenForm, { TokenFormValues } from "@/components/TokenForm/TokenForm"

export const VaultDepositForm: FC<VaultProps> = (props) => {
  const { data: poolId } = useVaultPoolId(props)
  const { address: userAddress } = useAccount()
  const chainId = useActiveChainId()
  const vault = useVault(props)
  const toastManager = useToast()
  const [depositToastId, setDepositToastId] = useState<string | undefined>()
  const [approveToastId, setApproveToastId] = useState<string | undefined>()
  const depositLoadingMsg = "Waiting for deposit transaction..."
  const depositSuccessMsg = "Deposit transaction done successfully."
  const depositErrorMsg = "Deposit transaction failed."
  const approveLoadingMsg = "Waiting for approve transaction..."
  const approveSuccessMsg = "Approve transaction done successfully."
  const approveErrorMsg = "Approve transaction failed."

  const underlyingAssets = vault.data?.underlyingAssets

  const invalidateHoldingsVaults = useInvalidateHoldingsVaults()

  // Configure form
  const form = useForm<TokenFormValues>({
    defaultValues: {
      amountIn: "",
      inputToken: props.asset,
      outputToken: props.vaultAddress,
    },
    mode: "all",
    reValidateMode: "onChange",
  })

  // Watch form values
  const amountIn = form.watch("amountIn")
  const amountInDebounced = useDebounce(amountIn, 500)
  const inputTokenAddress = form.watch("inputToken")
  // Calculate + fetch information on selected tokens
  const inputIsLp = inputTokenAddress === props.asset
  const inputIsEth = isEthTokenAddress(inputTokenAddress)
  const { data: inputToken } = useTokenOrNative({ address: inputTokenAddress })

  // preview redeem currently returns a value with slippage accounted for
  // no math is required here
  const value = parseUnits(amountInDebounced || "0", inputToken?.decimals ?? 18)

  // Check token approval if necessary
  const allowance = useContractRead({
    chainId,
    abi: erc20ABI,
    address: inputTokenAddress,
    functionName: "allowance",
    args: [userAddress ?? "0x", props.vaultAddress],
    enabled: !!userAddress && !inputIsEth,
    watch: true,
  })
  const requiresApproval = inputIsEth ? false : allowance.data?.lt(value)

  const onDepositStart = () => {
    const id = toastManager.loading(depositLoadingMsg)
    setDepositToastId(id)
  }

  const onDepositSuccess = (txHash: Address | undefined) => {
    form.resetField("amountIn")
    invalidateHoldingsVaults()
    toast.dismiss(depositToastId)
    toastManager.success(depositSuccessMsg, txHash ?? "0x")
  }

  const onDepositError = (txHash: Address | undefined) => {
    toast.dismiss(depositToastId)
    toastManager.error(depositErrorMsg, txHash ?? "0x")
  }

  const onApproveStart = () => {
    const id = toastManager.loading(approveLoadingMsg)
    setApproveToastId(id)
  }

  const onApproveSuccess = (txHash: Address | undefined) => {
    toast.dismiss(approveToastId)
    toastManager.success(approveSuccessMsg, txHash ?? "0x")
  }

  const onApproveError = (txHash: Address | undefined) => {
    toast.dismiss(approveToastId)
    toastManager.error(approveErrorMsg, txHash ?? "0x")
  }

  // Configure approve method
  const prepareApprove = usePrepareContractWrite({
    chainId,
    abi: erc20ABI,
    address: inputTokenAddress,
    functionName: "approve",
    args: [props.vaultAddress, ethers.constants.MaxUint256],
    enabled: requiresApproval,
  })
  const approve = useContractWrite(prepareApprove.config)
  const approveTxHash = approve.data?.hash
  const waitApprove = useWaitForTransaction({
    hash: approveTxHash,
    onSuccess: () => onApproveSuccess(approveTxHash),
    onError: () => onApproveError(approveTxHash),
  })

  const previewDeposit = usePreviewDeposit({
    chainId,
    id: poolId,
    token: inputTokenAddress,
    amount: value.toString(),
    type: props.type,
    enabled: value.gt(0),
  })

  const vaultContract = useVaultContract(props.vaultAddress)
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
  const depositTxHash = deposit.data?.hash
  const waitDeposit = useWaitForTransaction({
    hash: depositTxHash,
    onSuccess: () => onDepositSuccess(depositTxHash),
    onError: () => onDepositError(depositTxHash),
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
  const depositUnderlyingTxHash = depositUnderlying.data?.hash
  const waitDepositUnderlying = useWaitForTransaction({
    hash: depositUnderlyingTxHash,
    onSuccess: () => onDepositSuccess(depositUnderlyingTxHash),
    onError: () => onDepositError(depositUnderlyingTxHash),
  })

  // Form submit handler
  const onSubmitForm: SubmitHandler<TokenFormValues> = async () => {
    if (requiresApproval) {
      onApproveStart()
      fortLog("Approving spend", inputTokenAddress)
      approve?.write?.()
    } else {
      onDepositStart()
      if (enableDeposit) {
        fortLog("Depositing", amountInDebounced)
        deposit.write?.()
      }
      if (enableDepositUnderlying) {
        fortLog("Depositing underlying tokens", amountInDebounced)
        depositUnderlying.write?.()
      }
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
          asset={props.asset}
          tokenAddresses={underlyingAssets}
        />
      </FormProvider>
    </div>
  )
}
