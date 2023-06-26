import { FC, useState } from "react"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import {
  Address,
  erc20ABI,
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi"
import { shallow } from "zustand/shallow"

import { parseCurrencyUnits } from "@/lib/helpers"
import isEthTokenAddress from "@/lib/isEthTokenAddress"
import {
  useActiveChainId,
  useDebouncedValue,
  useInvalidateHoldingsVaults,
  usePreviewDeposit,
  useTokenApproval,
  useTokenOrNative,
  useTokenOrNativeBalance,
} from "@/hooks"
import { useVaultContract } from "@/hooks/lib/useVaultContract"

import {
  ConfirmTransactionModal,
  InvalidMinAmountModal,
} from "@/components/Modal"
import TokenForm, { TokenFormValues } from "@/components/TokenForm/TokenForm"
import { VaultRowPropsWithProduct } from "@/components/VaultRow/VaultRow"

import { useGlobalStore, useToastStore } from "@/store"

import { maxUint256 } from "@/constant"

export type VaultDepositWithdrawProps = VaultRowPropsWithProduct & {
  initInputToken: Address
  initOutputToken: Address
  underlyingAssets?: Address[] | readonly Address[]
}

export const VaultDepositForm: FC<VaultDepositWithdrawProps> = ({
  initInputToken,
  initOutputToken,
  underlyingAssets,
  ...props
}) => {
  const [addToast, replaceToast] = useToastStore(
    (state) => [state.addToast, state.replaceToast],
    shallow
  )

  const [showConfirmDepositModal, setShowConfirmDepositModal] = useState(false)
  const [showInvalidMinAmountModal, setShowInvalidMinAmountModal] =
    useState(false)

  const { address: userAddress } = useAccount()
  const chainId = useActiveChainId()
  const expertMode = useGlobalStore((store) => store.expertMode)

  const invalidateHoldingsVaults = useInvalidateHoldingsVaults()

  // Configure form
  const form = useForm<TokenFormValues>({
    defaultValues: {
      amountIn: "",
      inputToken: initInputToken,
      outputToken: initOutputToken,
    },
    mode: "all",
    reValidateMode: "onChange",
  })

  // Watch form values
  const amountIn = form.watch("amountIn")
  const [amountInDebounced, isDebounced] = useDebouncedValue(amountIn, 500, [
    amountIn,
  ])

  const inputTokenAddress = form.watch("inputToken")
  // Calculate + fetch information on selected tokens
  const inputIsLp = inputTokenAddress === initInputToken
  const inputIsEth = isEthTokenAddress(inputTokenAddress)
  const { data: inputToken } = useTokenOrNative({
    address: inputTokenAddress,
  })

  const inputTokenBalance = useTokenOrNativeBalance({
    address: inputTokenAddress,
  })
  const outputTokenBalance = useTokenOrNativeBalance({
    address: initOutputToken,
  })

  // preview redeem currently returns a value with slippage accounted for; no math is required here
  const value = parseCurrencyUnits({
    amountFormatted: amountInDebounced,
    decimals: inputToken?.decimals,
  })

  // Check token approval if necessary
  const allowance = useContractRead({
    chainId,
    abi: erc20ABI,
    address: inputTokenAddress,
    functionName: "allowance",
    args: [userAddress ?? "0x", initOutputToken],
    enabled: !!userAddress && !inputIsEth,
  })
  const requiresApproval = inputIsEth ? false : (allowance.data ?? 0n) < value

  // TODO: We still need to track transaction confirmations in here to call this function
  const onDepositSuccess = () => {
    form.resetField("amountIn")
    invalidateHoldingsVaults()
    inputTokenBalance.refetch()
    outputTokenBalance.refetch()
  }

  // Configure approve method
  const approval = useTokenApproval({
    amount: maxUint256,
    spender: initOutputToken,
    token: inputTokenAddress,
    enabled: !!requiresApproval,
  })

  const previewDeposit = usePreviewDeposit({
    ...props,
    chainId,
    token: inputTokenAddress,
    amount: value.toString(),
    enabled: value > 0,
  })

  const vaultContract = useVaultContract(initOutputToken)
  // Enable prepare hooks accordingly
  const enablePrepareTx =
    !form.formState.isValidating &&
    form.formState.isValid &&
    !previewDeposit.isFetching &&
    value > 0
  const enableDeposit =
    enablePrepareTx && !requiresApproval && inputIsLp && !!userAddress
  const enableDepositUnderlying =
    enablePrepareTx && !requiresApproval && !inputIsLp && !!userAddress

  // Configure depositLp method
  const prepareDeposit = usePrepareContractWrite({
    ...vaultContract,
    functionName: "deposit",
    enabled: enableDeposit,
    args: [value, userAddress ?? "0x"],
  })
  const deposit = useContractWrite(prepareDeposit.config)
  useWaitForTransaction({
    hash: deposit.data?.hash,
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
      BigInt(previewDeposit.data?.minAmountWei ?? 0),
    ],
    value: inputIsEth ? value : 0n,
  })
  const depositUnderlying = useContractWrite(prepareDepositUnderlying.config)
  useWaitForTransaction({
    hash: depositUnderlying.data?.hash,
    onSuccess: () => onDepositSuccess(),
  })
  // Form submit handler
  const onSubmitForm: SubmitHandler<TokenFormValues> = async () => {
    if (requiresApproval) {
      const action = "Token approval"
      const toastId = addToast({ type: "startTx", action })
      approval.write
        .writeAsync()
        .then((receipt) =>
          replaceToast(toastId, { type: "waitTx", hash: receipt.hash, action })
        )
        .catch((error) =>
          replaceToast(toastId, { type: "errorWrite", error, action })
        )
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
      const action = "Vault deposit"
      const toastId = addToast({ type: "startTx", action })
      deposit
        .writeAsync?.()
        .then((receipt) => {
          // this fires after the transaction has been broadcast successfully
          setShowConfirmDepositModal(false)
          replaceToast(toastId, { type: "waitTx", hash: receipt.hash, action })
        })
        .catch((error) =>
          replaceToast(toastId, { type: "errorWrite", error, action })
        )
    } else if (enableDepositUnderlying) {
      const action = "Vault deposit"
      const toastId = addToast({ type: "startTx", action })
      depositUnderlying
        .writeAsync?.()
        .then((receipt) => {
          // this fires after the transaction has been broadcast successfully
          setShowConfirmDepositModal(false)
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
        Deposit
      </h2>
      <FormProvider {...form}>
        <TokenForm
          isDebouncing={!!amountIn && !isDebounced}
          isError={prepareDeposit.isError || prepareDepositUnderlying.isError}
          isLoadingPreview={previewDeposit.isFetching}
          isLoadingTransaction={
            (amountInDebounced && allowance.isFetching) ||
            prepareDeposit.isLoading ||
            prepareDepositUnderlying.isLoading ||
            approval.write.isLoading ||
            deposit.isLoading ||
            depositUnderlying.isLoading ||
            previewDeposit.isFetching
          }
          onSubmit={onSubmitForm}
          submitText={requiresApproval ? "Approve" : "Deposit"}
          previewResultWei={previewDeposit.data?.resultWei}
          asset={initInputToken}
          tokenAddresses={underlyingAssets}
          productType={props.productType}
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
        outputTokenAddress={initOutputToken}
        isLoading={previewDeposit.isFetching}
        isPreparing={prepareDeposit.isFetching}
        isWaitingForSignature={deposit.isLoading || depositUnderlying.isLoading}
        productType={props.productType}
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
