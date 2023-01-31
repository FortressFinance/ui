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
import useTokenOrNative from "@/hooks/useTokenOrNative"

import { TokenFormValues } from "@/components/TokenForm/TokenForm"
import VaultWithdrawForm from "@/components/Vault/VaultForms/VaultWithdrawForm"

import curveCompounderAbi from "@/constant/abi/curveCompounderAbi"

const TokenWithdrawForm: FC<VaultProps> = (props) => {
  const { address: userAddress } = useAccount()
  const { data: vaultTokens } = useVaultTokens(props)
  const { data: ybToken } = useTokenOrNative({
    address: vaultTokens.ybTokenAddress,
  })
  const { data: outputToken } = useTokenOrNative({
    address: vaultTokens.underlyingAssetAddresses?.[0],
  })

  // Configure form
  const form = useForm<TokenFormValues>({
    defaultValues: {
      amountIn: "",
      amountOut: "",
      inputToken: vaultTokens.ybTokenAddress,
      outputToken: props.asset,
    },
    mode: "all",
    reValidateMode: "onChange",
  })
  const amountIn = form.watch("amountIn")
  const value = parseUnits(amountIn || "0", ybToken?.decimals || 18)

  // Configure preview withdraw method
  // TODO: This should use backend API methods once available
  const preview = useContractRead({
    address: props.asset,
    abi: curveCompounderAbi,
    functionName: "previewRedeem",
    args: [value],
    onSuccess: (data) => {
      form.setValue("amountOut", formatUnits(data, outputToken?.decimals || 18))
    },
  })

  // Configure redeem method
  const prepareWithdraw = usePrepareContractWrite({
    address: props.asset,
    abi: curveCompounderAbi,
    functionName: "redeem",
    enabled: value.gt(0),
    args: [value, userAddress ?? "0x", userAddress ?? "0x"],
  })
  const withdraw = useContractWrite(prepareWithdraw.config)

  return (
    <VaultWithdrawForm
      withdraw={{
        isLoading: prepareWithdraw.isLoading || withdraw.isLoading,
        txHash: withdraw.data?.hash,
        write: withdraw.write,
      }}
      form={form}
      preview={{ isLoading: preview.isLoading }}
      tokenAddresses={props.asset ? [props.asset] : []}
    />
  )
}

export default TokenWithdrawForm
