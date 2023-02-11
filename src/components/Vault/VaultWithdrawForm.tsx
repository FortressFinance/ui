import { BigNumber } from "ethers"
import { parseUnits } from "ethers/lib/utils.js"
import { FC, useEffect } from "react"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi"

import logger from "@/lib/logger"
import { VaultProps } from "@/lib/types"
import { useVaultPoolId, useVaultTokens } from "@/hooks/data"
import { useYbTokenToAsset } from "@/hooks/data/preview/useYbTokenToAsset"
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
  const value = parseUnits(amountIn || "0", ybToken?.decimals || 18)

  const onWithdrawSuccess = () => {
    form.resetField("amountIn")
    form.resetField("amountOut")
  }

  // Preview redeem method
  const { isLoading: isLoadingPreview, data: ybTokenToAsset } = useYbTokenToAsset({
    chainId,
    id: poolId,
    token: outputTokenAddress,
    amount: value.toString(),
    type: props.type
  })

  useEffect(() => {
    if(ybTokenToAsset)
    {
      form.setValue("amountOut", ybTokenToAsset.resultFormated)
    }
  }, [ybTokenToAsset, form])  

  // Configure redeemUnderlying method
  const prepareWithdrawUnderlying = usePrepareContractWrite({
    chainId,
    address: vaultAddress,
    abi: vaultCompounderAbi,
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
    chainId,
    address: vaultAddress,
    abi: vaultTokenAbi,
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
    chainId,
    address: vaultAddress,
    abi: vaultCompounderAbi,
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
    chainId,
    address: vaultAddress,
    abi: vaultCompounderAbi,
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
          tokenAddresses={[
            ...(underlyingAssets?.filter((a) => a !== lpTokenOrAsset) || []),
          ]}
          lpToken={lpTokenOrAsset}
          vaultType={props.type}
        />
      </FormProvider>
    </div>
  )
}

export default VaultWithdrawForm
