import { BigNumber } from "ethers"
import { parseUnits } from "ethers/lib/utils.js"
import { FC, useRef } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import {
  useAccount,
  useBalance,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi"

import logger from "@/lib/logger"
import useCompounderUnderlyingAssets from "@/hooks/data/useCompounderUnderlyingAssets"
import { VaultProps } from "@/hooks/types"
import useTokenOrNative from "@/hooks/useTokenOrNative"
import useTokenOrNativeBalance from "@/hooks/useTokenOrNativeBalance"

import Button from "@/components/Button"
import ConnectWalletButton from "@/components/ConnectWallet/ConnectWalletButton"
import TokenInput from "@/components/TokenInput"

import curveCompounderAbi from "@/constant/abi/curveCompounderAbi"

type VaultDepositFormProps = VaultProps & {
  //
}

type DepositFormValues = {
  amount: string
}

export const VaultDepositForm: FC<VaultDepositFormProps> = (props) => {
  const functionName = useRef("")
  const { isConnected } = useAccount()
  const { address } = useAccount()
  const { data: underlyingAssets } = useCompounderUnderlyingAssets({
    address: props.address,
    type: props.type,
  })
  const depositToken = underlyingAssets?.[underlyingAssets.length - 1]
  const { data: balance } = useTokenOrNativeBalance({ address: depositToken })
  const { data: token } = useTokenOrNative({ address: depositToken })

  const form = useForm<DepositFormValues>({
    defaultValues: {
      amount: "",
    },
    mode: "all",
    reValidateMode: "onChange",
  })

  const value = parseUnits(form.watch("amount") || "0", token?.decimals || 18)

  // const { data: approval, isLoading: isLoadingApproval } = useContractRead({
  //   address: props.address,
  //   abi: erc20ABI,
  //   functionName: "getApproved",
  // })
  // const { config: approveConfig, error: errorConfig } = usePrepareContractWrite(
  //   {
  //     address: props.address,
  //     abi: erc20ABI,
  //     functionName: "approve",
  //     args: [props.address, ethers.constants.MaxInt256],
  //   }
  // )

  const { config, isLoading: isLoadingPrepare } = usePrepareContractWrite({
    address: props.address,
    abi: curveCompounderAbi,
    functionName: "depositSingleUnderlying",
    enabled: value.gt(0),
    args: [value, depositToken ?? "0x", address ?? "0x", BigNumber.from(0)],
    overrides: { value },
  })
  const {
    data: tx,
    write: deposit,
    isLoading: isLoadingDeposit,
  } = useContractWrite(config)
  const { isLoading: isTransactionPending } = useWaitForTransaction({
    hash: tx?.hash,
    onSuccess: () => form.reset({ amount: "" }),
  })

  const onClickMax = (amount: string) => {
    logger("Setting value to max amount", amount)
    form.setValue("amount", amount, {
      shouldDirty: true,
      shouldValidate: true,
      shouldTouch: true,
    })
  }

  const onSubmitForm: SubmitHandler<DepositFormValues> = async ({ amount }) => {
    if (deposit) {
      logger("Depositing", amount)
      deposit()
    }
  }

  return (
    <div className="rounded-md bg-white/10 p-4">
      <h2 className="mb-3 text-center font-medium">Deposit</h2>
      <form onSubmit={form.handleSubmit(onSubmitForm)}>
        <TokenInput
          onClickMax={onClickMax}
          address={depositToken ?? "0x"}
          {...form.register("amount", {
            validate: {
              positive: (amount) => Number(amount) > 0 || "Enter an amount",
              lessThanBalance: (amount) =>
                parseUnits(amount, token?.decimals).lte(balance?.value ?? 0) ||
                `Insufficient ${token?.symbol ?? ""} balance`,
            },
          })}
        />
        {isConnected ? (
          <Button
            className="mt-3 grid w-full"
            disabled={!form.formState.isValid}
            isLoading={
              isLoadingPrepare || isLoadingDeposit || isTransactionPending
            }
            type="submit"
          >
            {form.formState.isDirty
              ? form.formState.errors.amount?.message ?? "Deposit"
              : "Enter an amount"}
          </Button>
        ) : (
          <ConnectWalletButton className="mt-3 w-full" />
        )}
      </form>
    </div>
  )
}

export const VaultWithdrawForm: FC<VaultDepositFormProps> = (props) => {
  const { address, isConnected } = useAccount()
  const { data: underlyingAssets } = useCompounderUnderlyingAssets({
    address: props.address,
    type: props.type,
  })
  const withdrawToken = underlyingAssets?.[underlyingAssets.length - 1]
  const { data: balance } = useBalance({ address, token: props.address })
  const { data: token } = useTokenOrNative({ address: props.address })

  const form = useForm<DepositFormValues>({
    defaultValues: {
      amount: "",
    },
    mode: "all",
    reValidateMode: "onChange",
  })

  const value = parseUnits(form.watch("amount") || "0", token?.decimals || 18)

  const { config, isLoading: isLoadingPrepare } = usePrepareContractWrite({
    address: props.address,
    abi: curveCompounderAbi,
    functionName: "redeemSingleUnderlying",
    enabled: value.gt(0),
    args: [
      value,
      withdrawToken ?? "0x",
      address ?? "0x",
      address ?? "0x",
      BigNumber.from(0),
    ],
  })
  const {
    data: tx,
    write: withdraw,
    isLoading: isLoadingWithdraw,
  } = useContractWrite(config)
  const { isLoading: isTransactionPending } = useWaitForTransaction({
    hash: tx?.hash,
    onSuccess: () => form.reset({ amount: "" }),
  })

  const onClickMax = (amount: string) => {
    logger("Setting value to max amount", amount)
    form.setValue("amount", amount, {
      shouldDirty: true,
      shouldValidate: true,
      shouldTouch: true,
    })
  }

  const onSubmitForm: SubmitHandler<DepositFormValues> = ({ amount }) => {
    if (withdraw) {
      withdraw()
      logger("Withdrawing", amount)
    }
  }

  return (
    <div className="rounded-md bg-white/10 p-4">
      <h2 className="mb-3 text-center font-medium">Withdraw</h2>
      <form onSubmit={form.handleSubmit(onSubmitForm)}>
        <TokenInput
          onClickMax={onClickMax}
          address={props.address}
          {...form.register("amount", {
            validate: {
              positive: (amount) => Number(amount) > 0 || "Enter an amount",
              lessThanBalance: (amount) =>
                parseUnits(amount, token?.decimals).lte(balance?.value ?? 0) ||
                `Insufficient ${token?.symbol ?? ""} balance`,
            },
          })}
        />
        {isConnected ? (
          <Button
            className="mt-3 grid w-full"
            disabled={!form.formState.isValid}
            isLoading={
              isLoadingPrepare || isLoadingWithdraw || isTransactionPending
            }
            type="submit"
          >
            {form.formState.isDirty
              ? form.formState.errors.amount?.message ?? "Withdraw"
              : "Enter an amount"}
          </Button>
        ) : (
          <ConnectWalletButton className="mt-3 w-full" />
        )}
      </form>
    </div>
  )
}
