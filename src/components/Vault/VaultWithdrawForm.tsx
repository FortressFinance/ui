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
import { useVaultTokens } from "@/hooks/data"
import { VaultProps } from "@/hooks/types"
import useActiveChainId from "@/hooks/useActiveChainId"
import useIsTokenCompounder from "@/hooks/useIsTokenCompounder"
import useTokenOrNative from "@/hooks/useTokenOrNative"

import TokenForm, { TokenFormValues } from "@/components/TokenForm/TokenForm"

import auraBalCompounderAbi from "@/constant/abi/auraBALCompounderAbi"
import curveCompounderAbi from "@/constant/abi/curveCompounderAbi"

const VaultWithdrawForm: FC<VaultProps> = (props) => {
  const chainId = useActiveChainId()
  const isToken = useIsTokenCompounder(props.type)
  const { address: userAddress } = useAccount()
  const { data: vaultTokens } = useVaultTokens(props)

  const lpTokenOrAsset = isToken
    ? vaultTokens.underlyingAssetAddresses?.[
        vaultTokens.underlyingAssetAddresses?.length - 1
      ]
    : props.asset
  const vaultAddress = vaultTokens.ybTokenAddress ?? "0x"
  const underlyingAssets = vaultTokens.underlyingAssetAddresses

  // Configure form
  const form = useForm<TokenFormValues>({
    defaultValues: {
      amountIn: "",
      amountOut: "",
      inputToken: vaultAddress,
      outputToken: lpTokenOrAsset ?? "0x",
    },
    mode: "all",
    reValidateMode: "onChange",
  })

  // Watch form values
  const amountIn = form.watch("amountIn")
  const outputTokenAddress = form.watch("outputToken")
  // Calculate + fetch information on selected tokens
  const outputIsLp = outputTokenAddress === lpTokenOrAsset
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
    chainId,
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
    enabled: value.gt(0) && !outputIsLp && !isToken,
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
    address: vaultAddress,
    abi: auraBalCompounderAbi,
    functionName: "redeemUnderlying",
    enabled: value.gt(0) && !outputIsLp && isToken,
    args: [value, userAddress ?? "0x", userAddress ?? "0x", BigNumber.from(0)],
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
    address: vaultAddress,
    abi: curveCompounderAbi,
    functionName: "redeem",
    enabled: value.gt(0) && outputIsLp && !isToken,
    args: [value, userAddress ?? "0x", userAddress ?? "0x"],
  })
  const withdrawLp = useContractWrite(prepareWithdrawLp.config)
  const waitWithdrawLp = useWaitForTransaction({
    hash: withdrawLp.data?.hash,
    onSuccess: onWithdrawSuccess,
  })

  const prepareTokenWithdrawLp = usePrepareContractWrite({
    address: vaultAddress,
    abi: auraBalCompounderAbi,
    functionName: "redeem",
    enabled: value.gt(0) && outputIsLp && isToken,
    args: [value, userAddress ?? "0x", userAddress ?? "0x"],
  })
  const tokenWithdrawLp = useContractWrite(prepareTokenWithdrawLp.config)
  const waitTokenWithdrawLp = useWaitForTransaction({
    hash: tokenWithdrawLp.data?.hash,
    onSuccess: onWithdrawSuccess,
  })

  // Form submit handler
  const onSubmitForm: SubmitHandler<TokenFormValues> = async ({ amountIn }) => {
    logger("Withdrawing", amountIn)
    withdrawLp?.write
      ? withdrawLp.write()
      : withdrawUnderlying?.write
      ? withdrawUnderlying.write()
      : tokenWithdrawLp?.write
      ? tokenWithdrawLp.write()
      : tokenWithdrawUnderlying?.write
      ? tokenWithdrawUnderlying.write()
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
            tokenWithdrawLp.isLoading ||
            tokenWithdrawUnderlying.isLoading ||
            waitWithdrawLp.isLoading ||
            waitWithdrawUnderlying.isLoading ||
            waitTokenWithdrawLp.isLoading ||
            waitTokenWithdrawUnderlying.isLoading
          }
          onSubmit={onSubmitForm}
          submitText="Withdraw"
          tokenAddreseses={[
            ...(lpTokenOrAsset ? [lpTokenOrAsset ?? "0x"] : []),
            ...(underlyingAssets?.filter((a) => a !== lpTokenOrAsset) || []),
          ]}
        />
      </FormProvider>
    </div>
  )
}

export default VaultWithdrawForm
