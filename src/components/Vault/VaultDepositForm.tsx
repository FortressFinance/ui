import { ethers } from "ethers"
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
import { parseTokenUnits } from "@/lib/helpers"
import isEthTokenAddress from "@/lib/isEthTokenAddress"
import logger from "@/lib/logger"
import { VaultProps } from "@/lib/types"
import { useVaultContract } from "@/hooks/contracts/useVaultContract"
import { usePreviewDeposit } from "@/hooks/data/preview/usePreviewDeposit"
import { useVault, useVaultPoolId } from "@/hooks/data/vaults"
import useActiveChainId from "@/hooks/useActiveChainId"
import useTokenOrNative from "@/hooks/useTokenOrNative"

import TokenForm, { TokenFormValues } from "@/components/TokenForm/TokenForm"

const VaultDepositForm: FC<VaultProps> = (props) => {
  const { data: poolId } = useVaultPoolId(props)
  const { address: userAddress } = useAccount()
  const chainId = useActiveChainId()
  const vault = useVault(props)

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
  const amountOut = form.watch("amountOut")
  const inputTokenAddress = form.watch("inputToken")
  // Calculate + fetch information on selected tokens
  const inputIsLp = inputTokenAddress === props.asset
  const inputIsEth = isEthTokenAddress(inputTokenAddress)
  const { data: inputToken } = useTokenOrNative({
    address: inputTokenAddress,
  })

  // preview redeem currently returns a value with slippage accounted for
  // no math is required here
  const minAmount = parseTokenUnits(amountOut, inputToken?.decimals)
  const value = parseTokenUnits(amountIn, inputToken?.decimals)

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
  const enableDeposit = enablePrepareTx && !requiresApproval && inputIsLp
  const enableDepositUnderlying =
    enablePrepareTx && !requiresApproval && !inputIsLp

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

  const previewDeposit = usePreviewDeposit({
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

  const vaultContract = useVaultContract(props.vaultAddress)

  // Configure depositLp method
  const prepareDeposit = usePrepareContractWrite({
    ...vaultContract,
    functionName: "deposit",
    enabled: enableDeposit,
    args: [value, userAddress ?? "0x"],
  })
  const deposit = useContractWrite(prepareDeposit.config)
  const waitDeposit = useWaitForTransaction({
    hash: deposit.data?.hash,
    onSuccess: onDepositSuccess,
  })

  // Configure depositUnderlying method
  const prepareDepositUnderlying = usePrepareContractWrite({
    ...vaultContract,
    functionName: "depositUnderlying",
    enabled: enableDepositUnderlying,
    args: [inputTokenAddress, userAddress ?? "0x", value, minAmount],
    overrides: inputIsEth ? { value } : {},
  })
  const depositUnderlying = useContractWrite(prepareDepositUnderlying.config)
  const waitDepositUnderlying = useWaitForTransaction({
    hash: depositUnderlying.data?.hash,
    onSuccess: onDepositSuccess,
  })

  // Form submit handler
  const onSubmitForm: SubmitHandler<TokenFormValues> = async ({ amountIn }) => {
    if (requiresApproval) {
      logger("Approving spend", inputTokenAddress)
      approve?.write?.()
    } else {
      if (enableDeposit) {
        logger("Depositing", amountIn)
        deposit.write?.()
      }
      if (enableDepositUnderlying) {
        logger("Depositing underlying tokens", amountIn)
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
          isError={prepareDeposit.isError || prepareDepositUnderlying.isError}
          isLoadingPreview={previewDeposit.isFetching}
          isLoadingTransaction={
            isLoadingAllowance ||
            prepareApprove.isLoading ||
            prepareDeposit.isLoading ||
            prepareDepositUnderlying.isFetching ||
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
          asset={props.asset}
          tokenAddresses={underlyingAssets}
        />
      </FormProvider>
    </div>
  )
}

export default VaultDepositForm
