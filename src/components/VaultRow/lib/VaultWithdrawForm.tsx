import { BigNumber } from "ethers"
import { parseUnits } from "ethers/lib/utils.js"
import { FC, useState } from "react"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import {
  Address,
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi"

import { fortLog } from "@/lib/fortLog"
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

import TokenForm, { TokenFormValues } from "@/components/TokenForm/TokenForm"

export const VaultWithdrawForm: FC<VaultProps> = (props) => {
  const { data: poolId } = useVaultPoolId(props)
  const chainId = useActiveChainId()
  const { address: userAddress } = useAccount()
  const vault = useVault(props)
  const toastManager = useToast()
  const [withdrawToastId, setWithdrawToastId] = useState<string | undefined>()
  const withdrawLoadingMsg = "Waiting for withdraw transaction..."
  const withdrawSuccessMsg = "Withdraw transaction done successfully."
  const withdrawErrorMsg = "Withdraw transaction failed."

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

  // preview redeem currently returns a value with slippage accounted for
  // no math is required here
  const value = parseUnits(amountInDebounced || "0", inputToken?.decimals ?? 18)

  const onWithdrawStart = () => {
    const id = toastManager.loading(withdrawLoadingMsg)
    setWithdrawToastId(id)
  }

  const onWithdrawSuccess = (txHash: Address | undefined) => {
    form.resetField("amountIn")
    invalidateHoldingsVaults()
    toast.dismiss(withdrawToastId)
    toastManager.success(withdrawSuccessMsg, txHash ?? "0x")
  }

  const onWithdrawError = (txHash: Address | undefined) => {
    toast.dismiss(withdrawToastId)
    toastManager.error(withdrawErrorMsg, txHash ?? "0x")
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
  const redeemTxHash = redeem.data?.hash
  const waitRedeem = useWaitForTransaction({
    hash: redeemTxHash,
    onSuccess: () => onWithdrawSuccess(redeemTxHash),
    onError: () => onWithdrawError(redeemTxHash),
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
  const redeemUnderlyingTxHash = redeemUnderlying.data?.hash
  const waitRedeemUnderlying = useWaitForTransaction({
    hash: redeemUnderlying.data?.hash,
    onSuccess: () => onWithdrawSuccess(redeemUnderlyingTxHash),
    onError: () => onWithdrawError(redeemUnderlyingTxHash),
  })

  // Form submit handler
  const onSubmitForm: SubmitHandler<TokenFormValues> = async () => {
    onWithdrawStart()
    if (enableRedeem) {
      fortLog("Redeeming", amountInDebounced)
      redeem.write?.()
    }
    if (enableRedeemUnderlying) {
      fortLog("Redeeming underlying tokens", amountInDebounced)
      redeemUnderlying.write?.()
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
    </div>
  )
}
