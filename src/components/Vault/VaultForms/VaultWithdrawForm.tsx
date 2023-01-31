import { FC } from "react"
import { FormProvider, SubmitHandler, UseFormReturn } from "react-hook-form"
import { Address, useWaitForTransaction } from "wagmi"

import logger from "@/lib/logger"

import TokenForm, { TokenFormValues } from "@/components/TokenForm/TokenForm"

type VaultWithdrawFormInnerProps = {
  form: UseFormReturn<TokenFormValues>
  withdraw: {
    isLoading: boolean
    txHash: Address | undefined
    write: (() => void) | undefined
  }
  preview: {
    isLoading: boolean
  }
  tokenAddresses: Address[]
}

const VaultDepositForm: FC<VaultWithdrawFormInnerProps> = ({
  form,
  withdraw,
  preview,
  tokenAddresses,
}) => {
  const { isLoading: isTxPending } = useWaitForTransaction({
    hash: withdraw.txHash,
    onSuccess: () => {
      form.resetField("amountIn")
      form.resetField("amountOut")
    },
  })
  const onSubmitForm: SubmitHandler<TokenFormValues> = async ({ amountIn }) => {
    logger("Withdrawing", amountIn)
    withdraw.write?.()
  }

  return (
    <div className="rounded-md bg-white/10 p-4">
      <h2 className="mb-3 text-center font-medium">Withdraw</h2>
      <FormProvider {...form}>
        <TokenForm
          isWithdraw
          isLoadingPreview={preview.isLoading}
          isLoadingTransaction={withdraw.isLoading || isTxPending}
          onSubmit={onSubmitForm}
          submitText="Withdraw"
          tokenAddreseses={tokenAddresses}
        />
      </FormProvider>
    </div>
  )
}

export default VaultDepositForm
