import { FC } from "react"
import { FormProvider, SubmitHandler, UseFormReturn } from "react-hook-form"
import { Address, useWaitForTransaction } from "wagmi"

import logger from "@/lib/logger"
import { UseApproveTokenResult } from "@/hooks/useApproveToken"

import TokenForm, { TokenFormValues } from "@/components/TokenForm/TokenForm"

type VaultDepositFormInnerProps = {
  form: UseFormReturn<TokenFormValues>
  approval?: UseApproveTokenResult
  deposit: {
    isLoading: boolean
    txHash: Address | undefined
    write: (() => void) | undefined
  }
  preview: {
    isLoading: boolean
  }
  tokenAddresses: Address[]
}

const VaultDepositForm: FC<VaultDepositFormInnerProps> = ({
  form,
  approval,
  deposit,
  preview,
  tokenAddresses,
}) => {
  const { isLoading: isTxPending } = useWaitForTransaction({
    hash: deposit.txHash,
    onSuccess: () => {
      form.resetField("amountIn")
      form.resetField("amountOut")
    },
  })
  const onSubmitForm: SubmitHandler<TokenFormValues> = async ({ amountIn }) => {
    if (approval && approval?.isRequired) {
      logger("Approving spend", amountIn)
      approval.write?.()
    } else {
      logger("Depositing", amountIn)
      deposit.write?.()
    }
  }

  return (
    <div className="rounded-md bg-white/10 p-4">
      <h2 className="mb-3 text-center font-medium">Deposit</h2>
      <FormProvider {...form}>
        <TokenForm
          isLoadingPreview={preview.isLoading}
          isLoadingTransaction={deposit.isLoading || isTxPending}
          onSubmit={onSubmitForm}
          submitText={approval?.isRequired ? "Approve" : "Deposit"}
          tokenAddreseses={tokenAddresses}
        />
      </FormProvider>
    </div>
  )
}

export default VaultDepositForm
