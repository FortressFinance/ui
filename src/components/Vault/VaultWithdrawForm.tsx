import { BigNumber } from "ethers"
import { parseUnits } from "ethers/lib/utils.js"
import { FC } from "react"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi"

import { toFixed } from "@/lib/api/util/format"
import logger from "@/lib/logger"
import { VaultProps } from "@/lib/types"
import { usePreviewRedeem } from "@/hooks/data/preview/usePreviewRedeem"
import { useVault, useVaultPoolId } from "@/hooks/data/vaults"
import useActiveChainId from "@/hooks/useActiveChainId"
import useTokenOrNative from "@/hooks/useTokenOrNative"
import { useIsTokenCompounder } from "@/hooks/useVaultTypes"

import TokenForm, { TokenFormValues } from "@/components/TokenForm/TokenForm"

import { vaultCompounderAbi, vaultTokenAbi } from "@/constant/abi"

const VaultWithdrawForm: FC<VaultProps> = (props) => {
  const { data: poolId } = useVaultPoolId(props)
  const chainId = useActiveChainId()
  const isToken = useIsTokenCompounder(props.type)
  const { address: userAddress } = useAccount()
  const vault = useVault(props)

  const underlyingAssets = vault.data?.underlyingAssets

  // Configure form
  const form = useForm<TokenFormValues>({
    defaultValues: {
      amountIn: "",
      amountOut: "",
      inputToken: props.vaultAddress,
      outputToken: props.asset ?? "0x",
    },
    mode: "all",
    reValidateMode: "onChange",
  })

  // Watch form values
  const amountIn = form.watch("amountIn")
  const outputTokenAddress = form.watch("outputToken")
  // Calculate + fetch information on selected tokens
  const outputIsLp = outputTokenAddress === props.asset
  const { data: ybToken } = useTokenOrNative({ address: props.vaultAddress })
  const value = parseUnits(amountIn || "0", ybToken?.decimals || 18)
  // Enable/disable prepare hooks based on form state
  const enablePrepareTx =
    !form.formState.isValidating && form.formState.isValid && value.gt(0)
  const enableWithdrawUnderlying = enablePrepareTx && !outputIsLp && !isToken
  const enableWithdrawTokenUnderlying =
    enablePrepareTx && !outputIsLp && isToken
  const enableWithdrawLp = enablePrepareTx && outputIsLp && !isToken
  const enableWithdrawTokenLp = enablePrepareTx && outputIsLp && isToken

  const onWithdrawSuccess = () => {
    form.resetField("amountIn")
    form.resetField("amountOut")
  }

  // Preview redeem method
  const { isFetching: isLoadingPreview } = usePreviewRedeem({
    chainId,
    id: poolId,
    token: outputTokenAddress,
    amount: value.toString(),
    type: props.type,
    enabled: value.gt(0),
    onSuccess: (data) => {
      form.setValue("amountOut", toFixed(data.resultFormated ?? "0.0", 6))
    },
    onError: () => {
      form.resetField("amountOut")
    },
  })

  // Configure redeemUnderlying method
  const prepareWithdrawUnderlying = usePrepareContractWrite({
    chainId,
    address: props.vaultAddress,
    abi: vaultCompounderAbi,
    functionName: "redeemSingleUnderlying",
    enabled: enableWithdrawUnderlying,
    args: [
      value,
      outputTokenAddress,
      userAddress ?? "0x",
      userAddress ?? "0x",
      BigNumber.from(0),
    ],
  })
  const withdrawUnderlying = useContractWrite(prepareWithdrawUnderlying.config)
  const waitWithdrawUnderlying = useWaitForTransaction({
    hash: withdrawUnderlying.data?.hash,
    onSuccess: onWithdrawSuccess,
  })

  const prepareTokenWithdrawUnderlying = usePrepareContractWrite({
    chainId,
    address: props.vaultAddress,
    abi: vaultTokenAbi,
    functionName: "redeemUnderlying",
    enabled: enableWithdrawTokenUnderlying,
    args: [
      outputTokenAddress,
      value,
      userAddress ?? "0x",
      userAddress ?? "0x",
      BigNumber.from(0),
    ],
  })
  const tokenWithdrawUnderlying = useContractWrite(
    prepareTokenWithdrawUnderlying.config
  )
  const waitTokenWithdrawUnderlying = useWaitForTransaction({
    hash: tokenWithdrawUnderlying.data?.hash,
    onSuccess: onWithdrawSuccess,
  })

  // Configure redeemLp method
  const prepareWithdrawLp = usePrepareContractWrite({
    chainId,
    address: props.vaultAddress,
    abi: vaultCompounderAbi,
    functionName: "redeem",
    enabled: enableWithdrawLp,
    args: [value, userAddress ?? "0x", userAddress ?? "0x"],
  })
  const withdrawLp = useContractWrite(prepareWithdrawLp.config)
  const waitWithdrawLp = useWaitForTransaction({
    hash: withdrawLp.data?.hash,
    onSuccess: onWithdrawSuccess,
  })

  const prepareTokenWithdrawLp = usePrepareContractWrite({
    chainId,
    address: props.vaultAddress,
    abi: vaultCompounderAbi,
    functionName: "redeem",
    enabled: enableWithdrawTokenLp,
    args: [value, userAddress ?? "0x", userAddress ?? "0x"],
  })
  const tokenWithdrawLp = useContractWrite(prepareTokenWithdrawLp.config)
  const waitTokenWithdrawLp = useWaitForTransaction({
    hash: tokenWithdrawLp.data?.hash,
    onSuccess: onWithdrawSuccess,
  })

  // Form submit handler
  const onSubmitForm: SubmitHandler<TokenFormValues> = async ({ amountIn }) => {
    if (enableWithdrawLp) {
      logger("Withdrawing LP", amountIn)
      withdrawLp.write?.()
    }
    if (enableWithdrawUnderlying) {
      logger("Withdrawing LP underlying", amountIn)
      withdrawUnderlying.write?.()
    }
    if (enableWithdrawTokenLp) {
      logger("Withdrawing token", amountIn)
      tokenWithdrawLp.write?.()
    }
    if (enableWithdrawTokenUnderlying) {
      logger("Withdrawing token underlying", amountIn)
      tokenWithdrawUnderlying.write?.()
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
          isError={
            prepareTokenWithdrawLp.isError ||
            prepareTokenWithdrawUnderlying.isError ||
            prepareWithdrawLp.isError ||
            prepareWithdrawUnderlying.isRefetching
          }
          isLoadingPreview={isLoadingPreview}
          isLoadingTransaction={
            prepareWithdrawLp.isLoading ||
            prepareWithdrawUnderlying.isLoading ||
            withdrawLp.isLoading ||
            withdrawUnderlying.isLoading ||
            tokenWithdrawLp.isLoading ||
            tokenWithdrawUnderlying.isLoading ||
            waitWithdrawLp.isLoading ||
            waitWithdrawUnderlying.isLoading ||
            waitTokenWithdrawLp.isLoading ||
            waitTokenWithdrawUnderlying.isLoading
          }
          onSubmit={onSubmitForm}
          submitText="Withdraw"
          asset={props.asset}
          tokenAddresses={underlyingAssets}
        />
      </FormProvider>
    </div>
  )
}

export default VaultWithdrawForm
