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
import { useVaultContract } from "@/hooks/contracts/useVaultContract"
import { usePreviewRedeem } from "@/hooks/data/preview/usePreviewRedeem"
import { useVault, useVaultPoolId } from "@/hooks/data/vaults"
import useActiveChainId from "@/hooks/useActiveChainId"
import useTokenOrNative from "@/hooks/useTokenOrNative"

import TokenForm, { TokenFormValues } from "@/components/TokenForm/TokenForm"

import { useTxSettings } from "@/store/txSettings"

const VaultWithdrawForm: FC<VaultProps> = (props) => {
  const { data: poolId } = useVaultPoolId(props)
  const chainId = useActiveChainId()
  const { address: userAddress } = useAccount()
  const vault = useVault(props)

  const slippage = useTxSettings((store) => store.slippageTolerance)

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

  const amountInNumber = Number(amountIn)
  const minAmountNumber = isNaN(amountInNumber)
    ? 0
    : amountInNumber - (amountInNumber * slippage) / 100
  const minAmount = parseUnits(
    minAmountNumber.toString(),
    ybToken?.decimals || 18
  )

  const value = parseUnits(amountIn || "0", ybToken?.decimals || 18)
  // Enable/disable prepare hooks based on form state
  const enablePrepareTx =
    !form.formState.isValidating && form.formState.isValid && value.gt(0)
  const enableRedeem = enablePrepareTx && outputIsLp
  const enableRedeemUnderlying = enablePrepareTx && !outputIsLp

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

  const vaultContract = useVaultContract(props.vaultAddress)

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
    onSuccess: onWithdrawSuccess,
  })

  // Configure redeemUnderlying method
  const prepareRedeemUnderlying = usePrepareContractWrite({
    ...vaultContract,
    functionName: "redeemUnderlying",
    enabled: enableRedeemUnderlying,
    args: [
      value,
      outputTokenAddress,
      userAddress ?? "0x",
      userAddress ?? "0x",
      minAmount,
    ],
  })
  const redeemUnderlying = useContractWrite(prepareRedeemUnderlying.config)
  const waitRedeemUnderlying = useWaitForTransaction({
    hash: redeemUnderlying.data?.hash,
    onSuccess: onWithdrawSuccess,
  })

  // Form submit handler
  const onSubmitForm: SubmitHandler<TokenFormValues> = async ({ amountIn }) => {
    if (enableRedeem) {
      logger("Redeeming", amountIn)
      redeem.write?.()
    }
    if (enableRedeemUnderlying) {
      logger("Redeeming underlying tokens", amountIn)
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
          isError={prepareRedeem.isError || prepareRedeemUnderlying.isError}
          isLoadingPreview={isLoadingPreview}
          isLoadingTransaction={
            prepareRedeem.isLoading ||
            prepareRedeemUnderlying.isLoading ||
            redeem.isLoading ||
            redeemUnderlying.isLoading ||
            waitRedeem.isLoading ||
            waitRedeemUnderlying.isLoading
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
