import { BigNumber, ethers } from "ethers"
import { formatUnits, parseUnits } from "ethers/lib/utils.js"
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

import isEthTokenAddress from "@/lib/isEthTokenAddress"
import logger from "@/lib/logger"
import useCompounderPoolAsset from "@/hooks/data/useCompounderPoolAsset"
import { VaultDepositWithdrawProps } from "@/hooks/types"
import useIsTokenCompounder from "@/hooks/useIsTokenCompounder"
import useTokenOrNative from "@/hooks/useTokenOrNative"

import TokenForm, { TokenFormValues } from "@/components/TokenForm/TokenForm"

import auraBalCompounderAbi from "@/constant/abi/auraBALCompounderAbi"
import curveCompounderAbi from "@/constant/abi/curveCompounderAbi"

const VaultDepositForm: FC<VaultDepositWithdrawProps> = ({
  address: vaultAddress,
  type,
  underlyingAssets,
}) => {
  const isToken = useIsTokenCompounder(type)
  const { address: userAddress } = useAccount()
  const { data: lpTokenOrAsset } = useCompounderPoolAsset({
    address: vaultAddress,
    type,
  })

  // Configure form
  const form = useForm<TokenFormValues>({
    defaultValues: {
      amountIn: "",
      amountOut: "",
      inputToken: lpTokenOrAsset ?? "0x",
      outputToken: vaultAddress,
    },
    mode: "all",
    reValidateMode: "onChange",
  })

  // Watch form values
  const amountIn = form.watch("amountIn")
  const inputTokenAddress = form.watch("inputToken")
  // Calculate + fetch information on selected tokens
  const inputIsLp = inputTokenAddress === lpTokenOrAsset
  const inputIsEth = isEthTokenAddress(inputTokenAddress)
  const { data: ybToken } = useTokenOrNative({ address: vaultAddress })
  const { data: inputToken } = useTokenOrNative({
    address: inputTokenAddress,
  })
  const value = parseUnits(amountIn || "0", inputToken?.decimals || 18)

  // Check token approval if necessary
  const { data: allowance, isLoading: isLoadingAllowance } = useContractRead({
    abi: erc20ABI,
    address: inputTokenAddress,
    functionName: "allowance",
    args: [userAddress ?? "0x", vaultAddress],
    enabled: !!userAddress && !inputIsEth,
    watch: true,
  })
  const requiresApproval = inputIsEth ? false : allowance?.lt(value)

  const onDepositSuccess = () => {
    form.resetField("amountIn")
    form.resetField("amountOut")
  }

  // Configure approve method
  const prepareApprove = usePrepareContractWrite({
    abi: erc20ABI,
    address: inputTokenAddress,
    functionName: "approve",
    args: [vaultAddress, ethers.constants.MaxUint256],
    enabled: requiresApproval,
  })
  const approve = useContractWrite(prepareApprove.config)
  const waitApprove = useWaitForTransaction({
    hash: approve.data?.hash,
  })
  // Preview deposit method
  const { isLoading: isLoadingPreview } = useContractRead({
    abi: curveCompounderAbi,
    address: vaultAddress,
    functionName: "previewDeposit",
    args: [value],
    onSuccess: (data) => {
      form.setValue("amountOut", formatUnits(data, ybToken?.decimals || 18))
    },
  })
  // Configure depositUnderlying method
  const prepareDepositUnderlying = usePrepareContractWrite({
    abi: curveCompounderAbi,
    address: vaultAddress,
    functionName: "depositSingleUnderlying",
    enabled: value.gt(0) && !requiresApproval && !inputIsLp && !isToken,
    args: [value, inputTokenAddress, userAddress ?? "0x", BigNumber.from(0)],
    overrides: { value },
  })
  const depositUnderlying = useContractWrite(prepareDepositUnderlying.config)
  const waitDepositUnderlying = useWaitForTransaction({
    hash: depositUnderlying.data?.hash,
    onSuccess: onDepositSuccess,
  })

  const prepareTokenDepositUnderlying = usePrepareContractWrite({
    abi: auraBalCompounderAbi,
    address: vaultAddress,
    functionName: "depositUnderlying",
    enabled: value.gt(0) && !requiresApproval && !inputIsLp && isToken,
    args: [value, userAddress ?? "0x", BigNumber.from(0)],
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
    abi: curveCompounderAbi,
    address: vaultAddress,
    functionName: "deposit",
    enabled: value.gt(0) && !requiresApproval && inputIsLp && !isToken,
    args: [value, userAddress ?? "0x"],
  })
  const depositLp = useContractWrite(prepareDepositLp.config)
  const waitDepositLp = useWaitForTransaction({
    hash: depositLp.data?.hash,
    onSuccess: onDepositSuccess,
  })

  const prepareTokenDepositLp = usePrepareContractWrite({
    abi: auraBalCompounderAbi,
    address: vaultAddress,
    functionName: "deposit",
    enabled: value.gt(0) && !requiresApproval && inputIsLp && isToken,
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
      logger("Depositing", amountIn)
      !isToken
        ? depositLp?.write
          ? depositLp.write()
          : depositUnderlying?.write
          ? depositUnderlying.write()
          : null
        : tokenDepositLp?.write
        ? tokenDepositLp.write()
        : tokenDepositUnderlying?.write
        ? tokenDepositUnderlying.write()
        : null
    }
  }

  return (
    <div className="rounded-md bg-white/10 p-4">
      <h2 className="mb-3 text-center font-medium">Deposit</h2>
      <FormProvider {...form}>
        <TokenForm
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
            waitDepositUnderlying.isLoading
          }
          onSubmit={onSubmitForm}
          submitText={requiresApproval ? "Approve" : "Deposit"}
          tokenAddreseses={[
            ...(lpTokenOrAsset ? [lpTokenOrAsset] : []),
            ...(underlyingAssets || []),
          ]}
        />
      </FormProvider>
    </div>
  )
}

export default VaultDepositForm
