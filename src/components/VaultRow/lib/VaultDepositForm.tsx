import { BigNumber, ethers } from "ethers"
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

import { fortLog } from "@/lib/fortLog"
import isEthTokenAddress from "@/lib/isEthTokenAddress"
import { VaultProps } from "@/lib/types"
import {
  useActiveChainId,
  useInvalidateHoldingsVaults,
  useTokenOrNative,
  useVault,
  useVaultPoolId,
} from "@/hooks"
import { usePreviewDeposit } from "@/hooks/lib/api/usePreviewDeposit"
import { useVaultContract } from "@/hooks/lib/useVaultContract"

import TokenForm, { TokenFormValues } from "@/components/TokenForm/TokenForm"

export const VaultDepositForm: FC<VaultProps> = (props) => {
  const { data: poolId } = useVaultPoolId(props)
  const { address: userAddress } = useAccount()
  const chainId = useActiveChainId()
  const vault = useVault(props)

  const underlyingAssets = vault.data?.underlyingAssets

  const invalidateHoldingsVaults = useInvalidateHoldingsVaults()

  // Configure form
  const form = useForm<TokenFormValues>({
    defaultValues: {
      amountIn: "",
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
  const { data: inputToken } = useTokenOrNative({ address: inputTokenAddress })

  // preview redeem currently returns a value with slippage accounted for
  // no math is required here
  const value = parseUnits(amountIn || "0", inputToken?.decimals ?? 18)

  // Check token approval if necessary
  const { data: allowance, isLoading: isLoadingAllowance } = useContractRead({
    chainId,
    abi: erc20ABI,
    address: inputTokenAddress,
    functionName: "allowance",
    args: [userAddress ?? "0x", props.vaultAddress],
    enabled: !!userAddress && !inputIsEth,
    watch: true,
  })
  const requiresApproval = inputIsEth ? false : allowance?.lt(value)

  const onDepositSuccess = () => {
    form.resetField("amountIn")
    invalidateHoldingsVaults()
  }

  // Configure approve method
  const prepareApprove = usePrepareContractWrite({
    chainId,
    abi: erc20ABI,
    address: inputTokenAddress,
    functionName: "approve",
    args: [props.vaultAddress, ethers.constants.MaxUint256],
    enabled: requiresApproval,
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
  })

  const vaultContract = useVaultContract(props.vaultAddress)
  // Enable prepare hooks accordingly
  const enablePrepareTx =
    !form.formState.isValidating &&
    form.formState.isValid &&
    !previewDeposit.isFetching &&
    value.gt(0)
  const enableDeposit = enablePrepareTx && !requiresApproval && inputIsLp
  const enableDepositUnderlying =
    enablePrepareTx && !requiresApproval && !inputIsLp

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
    enabled: enableDepositUnderlying && previewDeposit.isSuccess,
    args: [
      inputTokenAddress,
      userAddress ?? "0x",
      value,
      BigNumber.from(previewDeposit.data?.minAmountWei ?? "0"),
    ],
    overrides: { value: inputIsEth ? value : BigNumber.from(0) },
  })
  const depositUnderlying = useContractWrite(prepareDepositUnderlying.config)
  const waitDepositUnderlying = useWaitForTransaction({
    hash: depositUnderlying.data?.hash,
    onSuccess: onDepositSuccess,
  })

  // Form submit handler
  const onSubmitForm: SubmitHandler<TokenFormValues> = async ({ amountIn }) => {
    if (requiresApproval) {
      fortLog("Approving spend", inputTokenAddress)
      approve?.write?.()
    } else {
      if (enableDeposit) {
        fortLog("Depositing", amountIn)
        deposit.write?.()
      }
      if (enableDepositUnderlying) {
        fortLog("Depositing underlying tokens", amountIn)
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
          isError={prepareDeposit.isError}
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
          preview={previewDeposit}
          asset={props.asset}
          tokenAddresses={underlyingAssets}
        />
      </FormProvider>
    </div>
  )
}
