import { BigNumber } from "ethers"
import { formatUnits, parseUnits } from "ethers/lib/utils.js"
import { FC } from "react"
import { useForm } from "react-hook-form"
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi"

import isEthTokenAddress from "@/lib/isEthTokenAddress"
import { useVaultTokens } from "@/hooks/data"
import { VaultProps } from "@/hooks/types"
import useApproveToken from "@/hooks/useApproveToken"
import useTokenOrNative from "@/hooks/useTokenOrNative"

import { TokenFormValues } from "@/components/TokenForm/TokenForm"
import VaultDepositForm from "@/components/Vault/VaultForms/VaultDepositForm"

import curveCompounderAbi from "@/constant/abi/curveCompounderAbi"

const CompounderDepositForm: FC<VaultProps> = (props) => {
  const { address: userAddress } = useAccount()
  const { data: vaultTokens } = useVaultTokens(props)
  const { data: ybToken } = useTokenOrNative({
    address: vaultTokens.ybTokenAddress,
  })

  // Configure form
  const form = useForm<TokenFormValues>({
    defaultValues: {
      amountIn: "",
      amountOut: "",
      inputToken: props.asset,
      outputToken: vaultTokens.ybTokenAddress,
    },
    mode: "all",
    reValidateMode: "onChange",
  })
  const amountIn = form.watch("amountIn")
  const inputTokenAddress = form.watch("inputToken")
  const { data: inputToken } = useTokenOrNative({ address: inputTokenAddress })
  const inputIsLp = inputTokenAddress === props.asset
  const inputIsEth = isEthTokenAddress(inputTokenAddress)
  const value = parseUnits(amountIn || "0", inputToken?.decimals || 18)

  // Check token approval
  const approval = useApproveToken({
    enabled: !inputIsEth,
    token: inputTokenAddress,
    spender: vaultTokens.ybTokenAddress,
    value,
  })

  // Configure preview deposit method
  // TODO: This should use backend API methods once available
  const preview = useContractRead({
    abi: curveCompounderAbi,
    address: vaultTokens.ybTokenAddress,
    functionName: "previewDeposit",
    args: [value],
    onSuccess: (data) => {
      form.setValue("amountOut", formatUnits(data, ybToken?.decimals || 18))
    },
  })

  // Configure depositUnderlying method
  const prepareDepositUnderlying = usePrepareContractWrite({
    abi: curveCompounderAbi,
    address: vaultTokens.ybTokenAddress,
    functionName: "depositSingleUnderlying",
    enabled: value.gt(0) && !approval.isRequired && !inputIsLp,
    args: [value, inputTokenAddress, userAddress ?? "0x", BigNumber.from(0)],
    overrides: { value },
  })
  const depositUnderlying = useContractWrite(prepareDepositUnderlying.config)

  // Configure depositLp method
  const prepareDepositLp = usePrepareContractWrite({
    abi: curveCompounderAbi,
    address: vaultTokens.ybTokenAddress,
    functionName: "deposit",
    enabled: value.gt(0) && !approval.isRequired && inputIsLp,
    args: [value, userAddress ?? "0x"],
  })
  const depositLp = useContractWrite(prepareDepositLp.config)

  return (
    <VaultDepositForm
      form={form}
      approval={approval}
      preview={{ isLoading: preview.isLoading }}
      deposit={{
        isLoading:
          prepareDepositUnderlying.isLoading ||
          depositUnderlying.isLoading ||
          prepareDepositLp.isLoading ||
          depositLp.isLoading,
        txHash: depositUnderlying.data?.hash || depositLp.data?.hash,
        write: depositUnderlying.write || depositLp.write,
      }}
      tokenAddresses={
        vaultTokens.underlyingAssetAddresses && props.asset
          ? [props.asset, ...vaultTokens.underlyingAssetAddresses]
          : []
      }
    />
  )
}

export default CompounderDepositForm
