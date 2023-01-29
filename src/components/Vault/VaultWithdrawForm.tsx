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
  const underlyingTokenAddress = form.watch("outputToken")
  // Calculate + fetch information on selected tokens
  const { data: ybToken } = useTokenOrNative({ address: vaultAddress })
  const { data: underlyingToken } = useTokenOrNative({
    address: underlyingTokenAddress,
  })
  const value = parseUnits(amountIn || "0", ybToken?.decimals || 18)

  // Preview redeem method
  const { isLoading: isLoadingPreview } = useContractRead({
    address: vaultAddress,
    abi: curveCompounderAbi,
    functionName: "previewRedeem",
    args: [value],
    onSuccess: (data) => {
      form.setValue(
        "amountOut",
        formatUnits(data, underlyingToken?.decimals || 18)
      )
    },
  })
  // Configure redeem method
  const { config: withdrawConfig, isLoading: isPreparingWithdrawTx } =
    usePrepareContractWrite({
      address: vaultAddress,
      abi: curveCompounderAbi,
      functionName: "redeemSingleUnderlying",
      enabled: value.gt(0),
      args: [
        value,
        underlyingTokenAddress,
        userAddress ?? "0x",
        userAddress ?? "0x",
        BigNumber.from(0),
      ],
    })
  const {
    data: tx,
    write: withdraw,
    isLoading: isBroadcastingWithdrawTx,
  } = useContractWrite(withdrawConfig)
  const { isLoading: isWithdrawTxPending } = useWaitForTransaction({
    hash: tx?.hash,
    onSuccess: () => {
      form.resetField("amountIn")
      form.resetField("amountOut")
    },
  })

  // Form submit handler
  const onSubmitForm: SubmitHandler<TokenFormValues> = async ({ amountIn }) => {
    logger("Withdrawing", amountIn)
    withdraw?.()
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
            isPreparingWithdrawTx ||
            isBroadcastingWithdrawTx ||
            isWithdrawTxPending
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
