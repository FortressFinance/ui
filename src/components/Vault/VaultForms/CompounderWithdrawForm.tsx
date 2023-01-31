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

import { useVaultTokens } from "@/hooks/data"
import { VaultProps } from "@/hooks/types"
import useTokenOrNative from "@/hooks/useTokenOrNative"

import { TokenFormValues } from "@/components/TokenForm/TokenForm"
import VaultWithdrawForm from "@/components/Vault/VaultForms/VaultWithdrawForm"

import curveCompounderAbi from "@/constant/abi/curveCompounderAbi"

const CompounderWithdrawForm: FC<VaultProps> = (props) => {
  const { address: userAddress } = useAccount()
  const { data: vaultTokens } = useVaultTokens(props)

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
  const inputTokenAddress = form.watch("inputToken")
  const outputTokenAddress = form.watch("outputToken")
  const { data: inputToken } = useTokenOrNative({ address: inputTokenAddress })
  const { data: outputToken } = useTokenOrNative({
    address: outputTokenAddress,
  })
  const outputIsLp = outputTokenAddress === props.asset
  const value = parseUnits(amountIn || "0", inputToken?.decimals || 18)

  // Configure preview deposit method
  // TODO: This should use backend API methods once available
  const preview = useContractRead({
    address: vaultTokens.ybTokenAddress,
    abi: curveCompounderAbi,
    functionName: "previewRedeem",
    args: [value],
    onSuccess: (data) => {
      form.setValue("amountOut", formatUnits(data, outputToken?.decimals || 18))
    },
  })

  // Configure redeemUnderlying method
  const prepareWithdrawUnderlying = usePrepareContractWrite({
    address: vaultTokens.ybTokenAddress,
    abi: curveCompounderAbi,
    functionName: "redeemSingleUnderlying",
    enabled: value.gt(0) && !outputIsLp,
    args: [
      value,
      outputTokenAddress,
      userAddress ?? "0x",
      userAddress ?? "0x",
      BigNumber.from(0),
    ],
  })
  const withdrawUnderlying = useContractWrite(prepareWithdrawUnderlying.config)

  // Configure redeemLp method
  const prepareWithdrawLp = usePrepareContractWrite({
    address: vaultTokens.ybTokenAddress,
    abi: curveCompounderAbi,
    functionName: "redeem",
    enabled: value.gt(0) && outputIsLp,
    args: [value, userAddress ?? "0x", userAddress ?? "0x"],
  })
  const withdrawLp = useContractWrite(prepareWithdrawLp.config)

  return (
    <VaultWithdrawForm
      form={form}
      preview={{ isLoading: preview.isLoading }}
      withdraw={{
        isLoading:
          prepareWithdrawUnderlying.isLoading ||
          withdrawUnderlying.isLoading ||
          prepareWithdrawLp.isLoading ||
          withdrawLp.isLoading,
        txHash: withdrawUnderlying.data?.hash || withdrawLp.data?.hash,
        write: withdrawUnderlying.write || withdrawLp.write,
      }}
      tokenAddresses={
        vaultTokens.underlyingAssetAddresses && props.asset
          ? [props.asset, ...vaultTokens.underlyingAssetAddresses]
          : []
      }
    />
  )
}

export default CompounderWithdrawForm
