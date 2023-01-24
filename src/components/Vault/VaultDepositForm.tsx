import { BigNumber } from "ethers"
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
import useCompounderUnderlyingAssets from "@/hooks/data/useCompounderUnderlyingAssets"
import { VaultProps } from "@/hooks/types"
import useTokenOrNative from "@/hooks/useTokenOrNative"

import TokenForm, { TokenFormValues } from "@/components/TokenForm/TokenForm"

import curveCompounderAbi from "@/constant/abi/curveCompounderAbi"

const VaultDepositForm: FC<VaultProps> = ({ address: vaultAddress, type }) => {
  const { address: userAddress } = useAccount()
  const { data: underlyingAssets } = useCompounderUnderlyingAssets({
    address: vaultAddress,
    type,
  })

  // Configure form
  const form = useForm<TokenFormValues>({
    defaultValues: {
      amountIn: "",
      amountOut: "",
      inputToken: underlyingAssets?.[underlyingAssets.length - 1] ?? "0x",
      outputToken: vaultAddress,
    },
    mode: "all",
    reValidateMode: "onChange",
  })

  // Watch form values
  const amountIn = form.watch("amountIn")
  const underlyingTokenAddress = form.watch("inputToken")
  // Calculate + fetch information on selected tokens
  const isUnderlyingEth = isEthTokenAddress(underlyingTokenAddress)
  const { data: ybToken } = useTokenOrNative({ address: vaultAddress })
  const { data: underlyingToken } = useTokenOrNative({
    address: underlyingTokenAddress,
  })
  const value = parseUnits(amountIn || "0", underlyingToken?.decimals || 18)

  // Check token approval if necessary
  const { data: allowance, isLoading: isLoadingAllowance } = useContractRead({
    abi: erc20ABI,
    address: underlyingTokenAddress,
    functionName: "allowance",
    args: [userAddress ?? "0x", vaultAddress],
    enabled: !!userAddress && !isUnderlyingEth,
    watch: true,
  })
  const requiresApproval = isUnderlyingEth ? false : allowance?.lt(value)

  // Configure approve method
  const { config: approveConfig, isLoading: isPreparingApproveTx } =
    usePrepareContractWrite({
      abi: erc20ABI,
      address: underlyingTokenAddress,
      functionName: "approve",
      args: [vaultAddress, value],
      enabled: requiresApproval,
    })
  const {
    data: approvalTx,
    write: approve,
    isLoading: isBroadcastingApprovalTx,
  } = useContractWrite(approveConfig)
  const { isLoading: isApprovalTxPending } = useWaitForTransaction({
    hash: approvalTx?.hash,
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

  // Configure deposit method
  const { config, isLoading: isPreparingDepositTx } = usePrepareContractWrite({
    abi: curveCompounderAbi,
    address: vaultAddress,
    functionName: "depositSingleUnderlying",
    enabled: value.gt(0) && !requiresApproval,
    args: [
      value,
      underlyingTokenAddress,
      userAddress ?? "0x",
      BigNumber.from(0),
    ],
    overrides: { value },
  })
  const {
    data: depositTx,
    write: deposit,
    isLoading: isBroadcastingDepositTx,
  } = useContractWrite(config)
  const { isLoading: isDepositTxPending } = useWaitForTransaction({
    hash: depositTx?.hash,
    onSuccess: () => {
      form.resetField("amountIn")
      form.resetField("amountOut")
    },
  })

  // Form submit handler
  const onSubmitForm: SubmitHandler<TokenFormValues> = async ({ amountIn }) => {
    if (requiresApproval) {
      logger("Approving spend", underlyingTokenAddress)
      approve?.()
    } else {
      logger("Depositing", amountIn)
      deposit?.()
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
            isPreparingApproveTx ||
            isBroadcastingApprovalTx ||
            isApprovalTxPending ||
            isPreparingDepositTx ||
            isBroadcastingDepositTx ||
            isDepositTxPending
          }
          onSubmit={onSubmitForm}
          submitText={requiresApproval ? "Approve" : "Deposit"}
          tokenAddreseses={underlyingAssets}
        />
      </FormProvider>
    </div>
  )
}

export default VaultDepositForm
