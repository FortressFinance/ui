import { formatUnits, parseUnits } from "ethers/lib/utils.js"
import { FC } from "react"
import { useForm } from "react-hook-form"
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi"

import { useVaultTokens } from "@/hooks/data"
import { VaultProps } from "@/hooks/types"
import useApproveToken from "@/hooks/useApproveToken"
import useTokenOrNative from "@/hooks/useTokenOrNative"

import { TokenFormValues } from "@/components/TokenForm/TokenForm"
import VaultDepositForm from "@/components/Vault/VaultForms/VaultDepositForm"

import auraBalCompounderAbi from "@/constant/abi/auraBALCompounderAbi"

const TokenDepositForm: FC<VaultProps> = (props) => {
  const { address: userAddress } = useAccount()
  const { data: vaultTokens } = useVaultTokens(props)
  const { data: ybToken } = useTokenOrNative({
    address: vaultTokens.ybTokenAddress,
  })
  const { data: inputToken } = useTokenOrNative({ address: props.asset })

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
  const value = parseUnits(amountIn || "0", inputToken?.decimals || 18)

  // Configure approval
  const approval = useApproveToken({
    token: props.asset,
    spender: vaultTokens.ybTokenAddress,
    value,
  })

  // Configure preview deposit method
  // TODO: This should use backend API methods once available
  const preview = useContractRead({
    abi: auraBalCompounderAbi,
    address: props.asset,
    functionName: "previewDeposit",
    args: [value],
    onSuccess: (data) => {
      form.setValue("amountOut", formatUnits(data, ybToken?.decimals || 18))
    },
  })

  // Configure depositUnderlying method
  const prepareDeposit = usePrepareContractWrite({
    abi: auraBalCompounderAbi,
    address: props.asset,
    functionName: "deposit",
    enabled: value.gt(0) && !approval.isRequired,
    args: [value, userAddress ?? "0x"],
  })
  const deposit = useContractWrite(prepareDeposit.config)

  return (
    <VaultDepositForm
      approval={approval}
      deposit={{
        isLoading: prepareDeposit.isLoading || deposit.isLoading,
        txHash: deposit.data?.hash,
        write: deposit.write,
      }}
      form={form}
      preview={{ isLoading: preview.isLoading }}
      tokenAddresses={props.asset ? [props.asset] : []}
    />
  )
}

export default TokenDepositForm
