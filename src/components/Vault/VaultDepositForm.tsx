import { ethers } from "ethers"
import { parseUnits } from "ethers/lib/utils.js"
import { FC } from "react"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import {
  erc20ABI,
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi"

import { toFixed } from "@/lib/api/util/format"
import isEthTokenAddress from "@/lib/isEthTokenAddress"
import logger from "@/lib/logger"
import { VaultProps } from "@/lib/types"
import { usePreviewDeposit } from "@/hooks/data/preview/usePreviewDeposit"
import { useVault, useVaultPoolId } from "@/hooks/data/vaults"
import useActiveChainId from "@/hooks/useActiveChainId"
import useTokenOrNative from "@/hooks/useTokenOrNative"
import { useIsTokenCompounder } from "@/hooks/useVaultTypes"

import TokenForm, { TokenFormValues } from "@/components/TokenForm/TokenForm"

import { useTxSettings } from "@/store/txSettings"

import { vaultCompounderAbi, vaultTokenAbi } from "@/constant/abi"

const VaultDepositForm: FC<VaultProps> = (props) => {
  const { data: poolId } = useVaultPoolId(props)
  const isToken = useIsTokenCompounder(props.type)
  const { address: userAddress } = useAccount()
  const chainId = useActiveChainId()
  const vault = useVault(props)

  const slippage = useTxSettings((store) => store.slippageTolerance)

  const underlyingAssets = vault.data?.underlyingAssets

  // Configure form
  const form = useForm<TokenFormValues>({
    defaultValues: {
      amountIn: "",
      amountOut: "",
      inputToken: props.asset,
      outputToken: props.vaultAddress,
    },
    mode: "all",
    reValidateMode: "onChange",
  })

  // Watch form values
  const amountIn = form.watch("amountIn")
  const inputTokenAddress = form.watch("inputToken")
  // Calculate + fetch information on selected tokens
  const inputIsLp = inputTokenAddress === props.asset
  const inputIsEth = isEthTokenAddress(inputTokenAddress)
  const { data: inputToken } = useTokenOrNative({
    address: inputTokenAddress,
  })

  const amountInNumber = Number(amountIn)
  const minAmountNumber = isNaN(amountInNumber)
    ? 0
    : amountInNumber - (amountInNumber * slippage) / 100
  const minAmount = parseUnits(
    minAmountNumber.toString(),
    inputToken?.decimals || 18
  )
  const value = parseUnits(amountIn || "0", inputToken?.decimals || 18)

  // Check token approval if necessary
  const { data: allowance, isLoading: isLoadingAllowance } = useContractRead({
    chainId,
    abi: erc20ABI,
    address: inputTokenAddress,
    functionName: "allowance",
    args: [userAddress ?? "0x", props.vaultAddress ?? "0x"],
    enabled: !!userAddress && !inputIsEth && !!props.vaultAddress,
    watch: true,
  })
  const requiresApproval = inputIsEth ? false : allowance?.lt(value)

  // Enable prepare hooks accordingly
  const enablePrepareTx =
    !form.formState.isValidating && form.formState.isValid && value.gt(0)
  const enableDepositUnderlying =
    enablePrepareTx && !requiresApproval && !inputIsLp && !isToken
  const enableDepositTokenUnderlying =
    enablePrepareTx && !requiresApproval && !inputIsLp && isToken
  const enableDepositLp =
    enablePrepareTx && !requiresApproval && inputIsLp && !isToken
  const enableDepositTokenLp =
    enablePrepareTx && !requiresApproval && inputIsLp && isToken

  const onDepositSuccess = () => {
    form.resetField("amountIn")
    form.resetField("amountOut")
  }

  // Configure approve method
  const prepareApprove = usePrepareContractWrite({
    chainId,
    abi: erc20ABI,
    address: inputTokenAddress,
    functionName: "approve",
    args: [props.vaultAddress ?? "0x", ethers.constants.MaxUint256],
    enabled: requiresApproval && !!props.vaultAddress,
  })
  const approve = useContractWrite(prepareApprove.config)
  const waitApprove = useWaitForTransaction({
    hash: approve.data?.hash,
  })

  const { isFetching: isLoadingPreview } = usePreviewDeposit({
    chainId,
    id: poolId,
    token: inputTokenAddress,
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

  // Configure depositUnderlying method
  const prepareDepositUnderlying = usePrepareContractWrite({
    chainId,
    abi: vaultCompounderAbi,
    address: props.vaultAddress,
    functionName: "depositSingleUnderlying",
    enabled: enableDepositUnderlying,
    args: [value, inputTokenAddress, userAddress ?? "0x", minAmount],
    overrides: inputIsEth ? { value } : {},
  })
  const depositUnderlying = useContractWrite(prepareDepositUnderlying.config)
  const waitDepositUnderlying = useWaitForTransaction({
    hash: depositUnderlying.data?.hash,
    onSuccess: onDepositSuccess,
  })

  const prepareTokenDepositUnderlying = usePrepareContractWrite({
    chainId,
    abi: vaultTokenAbi,
    address: props.vaultAddress,
    functionName: "depositUnderlying",
    enabled: enableDepositTokenUnderlying,
    args: [inputTokenAddress, value, userAddress ?? "0x", minAmount],
    overrides: inputIsEth ? { value } : {},
  })
  const tokenDepositUnderlying = useContractWrite(
    prepareTokenDepositUnderlying.config
  )
  const waitTokenDepositUnderlying = useWaitForTransaction({
    hash: tokenDepositUnderlying.data?.hash,
    onSuccess: onDepositSuccess,
  })

  // Configure depositLp method
  const prepareDepositLp = usePrepareContractWrite({
    chainId,
    abi: vaultCompounderAbi,
    address: props.vaultAddress,
    functionName: "deposit",
    enabled: enableDepositLp,
    args: [value, userAddress ?? "0x"],
  })
  const depositLp = useContractWrite(prepareDepositLp.config)
  const waitDepositLp = useWaitForTransaction({
    hash: depositLp.data?.hash,
    onSuccess: onDepositSuccess,
  })

  const prepareTokenDepositLp = usePrepareContractWrite({
    chainId,
    abi: vaultCompounderAbi,
    address: props.vaultAddress,
    functionName: "deposit",
    enabled: enableDepositTokenLp,
    args: [value, userAddress ?? "0x"],
  })
  const tokenDepositLp = useContractWrite(prepareTokenDepositLp.config)
  const waitTokenDepositLp = useWaitForTransaction({
    hash: tokenDepositLp.data?.hash,
    onSuccess: onDepositSuccess,
  })

  // Form submit handler
  const onSubmitForm: SubmitHandler<TokenFormValues> = async ({ amountIn }) => {
    if (requiresApproval) {
      logger("Approving spend", inputTokenAddress)
      approve?.write?.()
    } else {
      if (enableDepositLp) {
        logger("Depositing LP", amountIn)
        depositLp.write?.()
      }
      if (enableDepositUnderlying) {
        logger("Depositing LP underlying", amountIn)
        depositUnderlying.write?.()
      }
      if (enableDepositTokenLp) {
        logger("Depositing token", amountIn)
        tokenDepositLp.write?.()
      }
      if (enableDepositTokenUnderlying) {
        logger("Depositing token underlying", amountIn)
        tokenDepositUnderlying.write?.()
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
          isError={
            prepareTokenDepositLp.isError ||
            prepareTokenDepositUnderlying.isError ||
            prepareDepositLp.isError ||
            prepareDepositUnderlying.isRefetching
          }
          isLoadingPreview={isLoadingPreview}
          isLoadingTransaction={
            isLoadingAllowance ||
            prepareApprove.isLoading ||
            prepareDepositLp.isLoading ||
            prepareDepositUnderlying.isLoading ||
            approve.isLoading ||
            depositLp.isLoading ||
            depositUnderlying.isLoading ||
            tokenDepositLp.isLoading ||
            tokenDepositUnderlying.isLoading ||
            waitApprove.isLoading ||
            waitDepositLp.isLoading ||
            waitDepositUnderlying.isLoading ||
            waitTokenDepositLp.isLoading ||
            waitDepositUnderlying.isLoading ||
            waitTokenDepositUnderlying.isLoading
          }
          onSubmit={onSubmitForm}
          submitText={requiresApproval ? "Approve" : "Deposit"}
          asset={props.asset}
          tokenAddresses={underlyingAssets}
        />
      </FormProvider>
    </div>
  )
}

export default VaultDepositForm
