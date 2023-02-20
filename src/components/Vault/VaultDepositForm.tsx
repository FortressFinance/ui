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

import { toFixed } from "@/lib/api/util/format"
import isEthTokenAddress from "@/lib/isEthTokenAddress"
import logger from "@/lib/logger"
import { VaultProps } from "@/lib/types"
import { useVaultPoolId, useVaultTokens } from "@/hooks/data"
import { usePreviewDeposit } from "@/hooks/data/preview/usePreviewDeposit"
import useActiveChainId from "@/hooks/useActiveChainId"
import useTokenOrNative from "@/hooks/useTokenOrNative"
import { useIsTokenCompounder } from "@/hooks/useVaultTypes"

import TokenForm, { TokenFormValues } from "@/components/TokenForm/TokenForm"

import { vaultCompounderAbi, vaultTokenAbi } from "@/constant/abi"

const VaultDepositForm: FC<VaultProps> = (props) => {
  const { data: poolId } = useVaultPoolId(props)
  const isToken = useIsTokenCompounder(props.type)
  const { address: userAddress } = useAccount()
  const chainId = useActiveChainId()
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
      inputToken: lpTokenOrAsset,
      outputToken: vaultTokens.ybTokenAddress,
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
  const { data: inputToken } = useTokenOrNative({
    address: inputTokenAddress,
  })
  const value = parseUnits(amountIn || "0", inputToken?.decimals || 18)

  // Check token approval if necessary
  const { data: allowance, isLoading: isLoadingAllowance } = useContractRead({
    chainId,
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
    chainId,
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

  const { isLoading: isLoadingPreview } = usePreviewDeposit({
    chainId,
    id: poolId,
    token: inputTokenAddress,
    amount: value.toString(),
    type: props.type,
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
    chainId,
    abi: vaultTokenAbi,
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
    chainId,
    abi: vaultCompounderAbi,
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
    chainId,
    abi: vaultCompounderAbi,
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
      depositLp?.write
        ? depositLp.write()
        : depositUnderlying?.write
        ? depositUnderlying.write()
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
            waitDepositUnderlying.isLoading ||
            waitTokenDepositUnderlying.isLoading
          }
          onSubmit={onSubmitForm}
          submitText={requiresApproval ? "Approve" : "Deposit"}
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

export default VaultDepositForm
