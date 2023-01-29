import { BigNumber } from "ethers"
import { formatUnits, parseUnits } from "ethers/lib/utils.js"
import { FC } from "react"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi"

import logger from "@/lib/logger"
import useCompounderPoolAsset from "@/hooks/data/useCompounderPoolAsset"
import useCompounderUnderlyingAssets from "@/hooks/data/useCompounderUnderlyingAssets"
import { VaultProps } from "@/hooks/types"
import useTokenOrNative from "@/hooks/useTokenOrNative"

import TokenForm, { TokenFormValues } from "@/components/TokenForm/TokenForm"

import curveCompounderAbi from "@/constant/abi/curveCompounderAbi"

const VaultWithdrawForm: FC<VaultProps> = ({ address: vaultAddress, type }) => {
  const { address: userAddress } = useAccount()
  const { data: lpToken } = useCompounderPoolAsset({
    address: vaultAddress,
    type,
  })
  const { data: underlyingAssets } = useCompounderUnderlyingAssets({
    address: vaultAddress,
    type,
  })

  // Configure form
  const form = useForm<TokenFormValues>({
    defaultValues: {
      amountIn: "",
      amountOut: "",
      inputToken: vaultAddress,
      outputToken: lpToken ?? "0x",
    },
    mode: "all",
    reValidateMode: "onChange",
  })

  // Watch form values
  const amountIn = form.watch("amountIn")
  const outputTokenAddress = form.watch("outputToken")
  // Calculate + fetch information on selected tokens
  const outputIsLp = outputTokenAddress === lpToken
  const { data: ybToken } = useTokenOrNative({ address: vaultAddress })
  const { data: outputToken } = useTokenOrNative({
    address: outputTokenAddress,
  })
  const value = parseUnits(amountIn || "0", ybToken?.decimals || 18)

  const onWithdrawSuccess = () => {
    form.resetField("amountIn")
    form.resetField("amountOut")
  }

  // Preview redeem method
  const { isLoading: isLoadingPreview } = useContractRead({
    address: vaultAddress,
    abi: curveCompounderAbi,
    functionName: "previewRedeem",
    args: [value],
    onSuccess: (data) => {
      form.setValue("amountOut", formatUnits(data, outputToken?.decimals || 18))
    },
  })
  // Configure redeemUnderlying method
  const prepareWithdrawUnderlying = usePrepareContractWrite({
    address: vaultAddress,
    abi: curveCompounderAbi,
    functionName: "redeemSingleUnderlying",
    enabled: value.gt(0) && !outputIsLp,
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
  // Configure redeemLp method
  const prepareWithdrawLp = usePrepareContractWrite({
    address: vaultAddress,
    abi: curveCompounderAbi,
    functionName: "redeem",
    enabled: value.gt(0) && outputIsLp,
    args: [value, userAddress ?? "0x", userAddress ?? "0x"],
  })
  const withdrawLp = useContractWrite(prepareWithdrawLp.config)
  const waitWithdrawLp = useWaitForTransaction({
    hash: withdrawLp.data?.hash,
    onSuccess: onWithdrawSuccess,
  })

  // Form submit handler
  const onSubmitForm: SubmitHandler<TokenFormValues> = async ({ amountIn }) => {
    logger("Withdrawing", amountIn)
    withdrawLp?.write
      ? withdrawLp.write()
      : withdrawUnderlying?.write
      ? withdrawUnderlying.write()
      : null
  }

  return (
    <div className="rounded-md bg-white/10 p-4">
      <h2 className="mb-3 text-center font-medium">Withdraw</h2>
      <FormProvider {...form}>
        <TokenForm
          isWithdraw
          isLoadingPreview={isLoadingPreview}
          isLoadingTransaction={
            isLoadingPreview ||
            prepareWithdrawLp.isLoading ||
            prepareWithdrawUnderlying.isLoading ||
            withdrawLp.isLoading ||
            withdrawUnderlying.isLoading ||
            waitWithdrawLp.isLoading ||
            waitWithdrawUnderlying.isLoading
          }
          onSubmit={onSubmitForm}
          submitText="Withdraw"
          tokenAddreseses={[
            ...(lpToken ? [lpToken] : []),
            ...(underlyingAssets || []),
          ]}
        />
      </FormProvider>
    </div>
  )
}

export default VaultWithdrawForm
